import { NextRequest, NextResponse } from 'next/server';
import { requireApiSession } from '../../../../lib/apihelpers';

interface GBVolumeInfo {
  description?: string;
  imageLinks?: { thumbnail?: string; smallThumbnail?: string };
}
interface GBResponse {
  totalItems: number;
  items?: Array<{ volumeInfo: GBVolumeInfo }>;
}

interface OLSearchResult {
  numFound: number;
  docs: Array<{
    cover_i?: number;
    first_sentence?: { value: string } | string;
  }>;
}
interface OLBookData {
  cover?: { large?: string; medium?: string };
  description?: string | { value: string };
}

// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const unauthorized = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? '';
  const author = searchParams.get('author') ?? '';
  const identifier = searchParams.get('identifier') ?? '';

  const isbnClean = identifier.replace(/[-\s]/g, '');
  const isIsbn = /^\d{10}$|^\d{13}$|^\d{9}X$/i.test(isbnClean);

  const tag = `[bookcover] "${title}" / "${author}"`;
  let coverUrl: string | null = null;
  let description: string | null = null;

  // ── 1. Google Books ────────────────────────────────────────────────────────
  // Tries queries from strictest to loosest; stops at first result.
  const gbQueries = buildGBQueries(isIsbn ? `isbn:${isbnClean}` : null, title, author);

  for (const q of gbQueries) {
    try {
      const url = new URL('https://www.googleapis.com/books/v1/volumes');
      url.searchParams.set('q', q);
      url.searchParams.set('maxResults', '1');

      const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
      console.log(`${tag} GB q="${q}" → HTTP ${res.status}`);
      if (!res.ok) { console.log(`${tag} GB non-ok, skipping`); break; }

      const data: GBResponse = await res.json();
      const info = data.items?.[0]?.volumeInfo;
      console.log(`${tag} GB totalItems=${data.totalItems}, hasImage=${!!info?.imageLinks?.thumbnail}`);
      if (!info) continue;

      if (info.imageLinks?.thumbnail) {
        coverUrl = info.imageLinks.thumbnail
          .replace('http://', 'https://')
          .replace('&edge=curl', '');
      }
      if (info.description) description = info.description;
      break;
    } catch (e) { console.log(`${tag} GB error: ${e}`); break; }
  }

  // ── 2. Open Library — free-text search ────────────────────────────────────
  // Uses q= (full-text) rather than title=/author= so Dutch translated titles
  // are found even when stored under their original English title in OL.
  if (!coverUrl && !isIsbn && (title || author)) {
    const olUrl = await openLibrarySearch(title, author, tag);
    if (olUrl) { coverUrl = olUrl.coverUrl; if (olUrl.description) description = olUrl.description; }
  }

  if (!coverUrl && isIsbn) {
    const olResult = await openLibraryByIsbn(isbnClean, tag);
    if (olResult) { coverUrl = olResult.coverUrl; if (olResult.description) description = olResult.description; }
  }

  // ── 3. KB (Koninklijke Bibliotheek) → resolve Dutch ISBN → retry ──────────
  // The Dutch national library catalog has all NL publications. Once we have
  // the Dutch ISBN we probe OL for its cover (200 = real cover, 302 = none),
  // then fall back to a Google Books ISBN lookup.
  if (!coverUrl && !isIsbn && (title || author)) {
    const kbIsbn = await resolveIsbnFromKB(title, author, tag);
    if (kbIsbn) {
      // Try OL cover by ISBN first (fast image probe)
      const olCoverUrl = `https://covers.openlibrary.org/b/isbn/${kbIsbn}-L.jpg`;
      try {
        const probe = await fetch(olCoverUrl, { redirect: 'manual', next: { revalidate: 86400 } });
        console.log(`${tag} KB→OL cover isbn=${kbIsbn} → HTTP ${probe.status}`);
        if (probe.status === 200) coverUrl = olCoverUrl;
      } catch (e) { console.log(`${tag} KB→OL probe error: ${e}`); }

      // Fall back to Google Books with the resolved ISBN
      if (!coverUrl) {
        try {
          const url = new URL('https://www.googleapis.com/books/v1/volumes');
          url.searchParams.set('q', `isbn:${kbIsbn}`);
          url.searchParams.set('maxResults', '1');
          const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
          console.log(`${tag} KB→GB isbn=${kbIsbn} → HTTP ${res.status}`);
          if (res.ok) {
            const data: GBResponse = await res.json();
            const info = data.items?.[0]?.volumeInfo;
            console.log(`${tag} KB→GB hasImage=${!!info?.imageLinks?.thumbnail}`);
            if (info?.imageLinks?.thumbnail) {
              coverUrl = info.imageLinks.thumbnail
                .replace('http://', 'https://')
                .replace('&edge=curl', '');
            }
            if (!description && info?.description) description = info.description;
          }
        } catch (e) { console.log(`${tag} KB→GB error: ${e}`); }
      }
    }
  }

  console.log(`${tag} result: coverUrl=${coverUrl ? 'found' : 'null'}`);
  return NextResponse.json({ coverUrl, description });
}

// ─── helpers ─────────────────────────────────────────────────────────────────

async function openLibrarySearch(
  title: string,
  author: string,
  tag: string,
): Promise<{ coverUrl: string | null; description: string | null } | null> {
  try {
    const q = [title, author].filter(Boolean).join(' ');
    const params = new URLSearchParams({ q, limit: '1' });
    const url = `https://openlibrary.org/search.json?${params}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    console.log(`${tag} OL search q="${q}" → HTTP ${res.status}`);
    if (!res.ok) return null;

    const data: OLSearchResult = await res.json();
    const doc = data.docs?.[0];
    console.log(`${tag} OL numFound=${data.numFound}, cover_i=${doc?.cover_i}`);
    if (!doc?.cover_i) return null;

    const description =
      doc.first_sentence == null ? null
      : typeof doc.first_sentence === 'string' ? doc.first_sentence
      : doc.first_sentence.value;

    return {
      coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
      description,
    };
  } catch (e) {
    console.log(`${tag} OL search error: ${e}`);
    return null;
  }
}

async function openLibraryByIsbn(
  isbn: string,
  tag: string,
): Promise<{ coverUrl: string | null; description: string | null } | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
      { next: { revalidate: 86400 } },
    );
    console.log(`${tag} OL isbn=${isbn} → HTTP ${res.status}`);
    if (!res.ok) return null;

    const data = await res.json();
    const book: OLBookData | undefined = data[`ISBN:${isbn}`];
    console.log(`${tag} OL book found=${!!book}, hasCover=${!!(book?.cover?.large ?? book?.cover?.medium)}`);
    if (!book) return null;

    const coverUrl = book.cover?.large ?? book.cover?.medium ?? null;
    const rawDesc = book.description;
    const description = !rawDesc ? null
      : typeof rawDesc === 'string' ? rawDesc
      : rawDesc.value ?? null;

    return { coverUrl, description };
  } catch (e) {
    console.log(`${tag} OL isbn error: ${e}`);
    return null;
  }
}

/**
 * Queries the Dutch national library catalog (KB) to resolve a title/author
 * to a Dutch ISBN. Returns null if nothing found or the result is ambiguous.
 *
 * KB SRU docs: https://www.kb.nl/organisatie/onderzoek-expertise/informatie-infrastructuur-diensten-voor-bibliotheken/bibliotheekinformatiesystemen/sru
 */
async function resolveIsbnFromKB(
  title: string,
  author: string,
  tag: string,
): Promise<string | null> {
  const queries = [
    // Precise: title + author
    ...(title && author ? [`(dc.title exact "${title}") and (dc.creator any "${author}")`] : []),
    // Title only — only use if the result set is small (≤ 5) to avoid false matches
    ...(title ? [`dc.title exact "${title}"`] : []),
  ];

  for (const query of queries) {
    try {
      const params = new URLSearchParams({
        operation: 'searchRetrieve',
        version: '1.2',
        recordSchema: 'dcx',
        'x-collection': 'GGC',
        query,
        maximumRecords: '3',
      });

      const res = await fetch(`https://jsru.kb.nl/sru/sru?${params}`, {
        next: { revalidate: 86400 },
      });
      console.log(`${tag} KB query="${query}" → HTTP ${res.status}`);
      if (!res.ok) break;

      const xml = await res.text();
      const nbMatch = xml.match(/<srw:numberOfRecords>(\d+)<\/srw:numberOfRecords>/);
      const numRecords = nbMatch ? parseInt(nbMatch[1], 10) : 0;
      console.log(`${tag} KB numberOfRecords=${numRecords}`);

      // Skip ambiguous results (title-only query with many hits)
      if (numRecords === 0 || numRecords > 5) continue;

      const isbnMatch = xml.match(/xsi:type="dcterms:ISBN">(\d{10,13}[Xx]?)<\/dc:identifier>/);
      if (isbnMatch) {
        console.log(`${tag} KB resolved isbn=${isbnMatch[1]}`);
        return isbnMatch[1];
      }
    } catch (e) {
      console.log(`${tag} KB error: ${e}`);
      break;
    }
  }
  return null;
}

/**
 * Returns Google Books query strings from strictest to most permissive.
 * Callers iterate and stop at the first query that returns results.
 */
function buildGBQueries(isbnQuery: string | null, title: string, author: string): string[] {
  if (isbnQuery) return [isbnQuery];

  const queries: string[] = [];
  if (title && author) queries.push(`intitle:${title} inauthor:${author}`);
  if (title)           queries.push(`intitle:${title}`);
  if (title || author) queries.push([title, author].filter(Boolean).join(' '));
  return queries;
}
