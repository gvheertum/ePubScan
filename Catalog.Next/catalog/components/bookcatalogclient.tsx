'use client'

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReadStatusBadge from "./readstatusbadge";
import { IBookCatalogPage, ReadStateElement, ReadStates } from "../lib/IBook";

type CatalogProps = {
  catalogPage: IBookCatalogPage;
};

const readStates = new ReadStates();

export default function BookCatalogClient({ catalogPage }: CatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(catalogPage.search ?? "");
  const [filterStatus, setFilterStatus] = useState<ReadStateElement>(
    getReadStateFromQuery(catalogPage.readStatus)
  );
  const deferredSearch = useDeferredValue(searchValue);
  const pageStart = catalogPage.filteredBooks === 0 ? 0 : (catalogPage.page - 1) * catalogPage.pageSize + 1;
  const pageEnd = Math.min(catalogPage.page * catalogPage.pageSize, catalogPage.filteredBooks);
  const pageNumbers = useMemo(
    () => buildPageNumbers(catalogPage.page, catalogPage.totalPages),
    [catalogPage.page, catalogPage.totalPages]
  );

  // Tracks the last search string we ourselves pushed to the URL so we can
  // distinguish "URL changed because we typed" from "URL changed externally
  // (back/forward)". Without this, each server round-trip resets the input.
  const lastSubmittedSearch = useRef(catalogPage.search ?? "");

  useEffect(() => {
    const urlQ = searchParams.get("q") ?? "";
    if (urlQ !== lastSubmittedSearch.current) {
      lastSubmittedSearch.current = urlQ;
      setSearchValue(urlQ);
    }
  }, [searchParams]);

  useEffect(() => {
    setFilterStatus(getReadStateFromQuery(catalogPage.readStatus));
  }, [catalogPage.readStatus]);

  useEffect(() => {
    const normalizedDeferredSearch = deferredSearch.trim();
    const currentSearch = searchParams.get("q") ?? "";

    if (normalizedDeferredSearch === currentSearch) {
      return;
    }

    lastSubmittedSearch.current = normalizedDeferredSearch;
    updateQuery({
      q: normalizedDeferredSearch,
      status: searchParams.get("status") ?? getQueryStatusValue(filterStatus),
      page: "1",
    });
  }, [deferredSearch, searchParams]);

  function updateQuery(updates: { q?: string; status?: string; page?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return (
    <div className="catalog-shell">
      <section className="catalog-hero">
        <div>
          <p className="catalog-eyebrow">Personal Library</p>
          <h1>Book catalog</h1>
          <p className="catalog-subtitle">
            A cleaner view over the collection with lightweight reads and faster server-side caching.
          </p>
        </div>
        <div className="catalog-stats">
          <div className="catalog-stat-card">
            <span>Total</span>
            <strong>{catalogPage.totalBooks}</strong>
          </div>
          <div className="catalog-stat-card">
            <span>Matches</span>
            <strong>{catalogPage.filteredBooks}</strong>
          </div>
          <button
            type="button"
            className={filterStatus.matches(readStates.Read.code) ? "catalog-stat-card catalog-stat-button active" : "catalog-stat-card catalog-stat-button"}
            onClick={() => applyFilter(readStates.Read)}
          >
            <span>Read</span>
            <strong>{catalogPage.readBooks}</strong>
          </button>
          <button
            type="button"
            className={filterStatus.matches(readStates.Reading.code) ? "catalog-stat-card catalog-stat-button active" : "catalog-stat-card catalog-stat-button"}
            onClick={() => applyFilter(readStates.Reading)}
          >
            <span>Reading</span>
            <strong>{catalogPage.readingBooks}</strong>
          </button>
        </div>
      </section>

      <section className="catalog-toolbar">
        <label className="catalog-search">
          <span>Search title, author, medium, status</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search your shelf"
          />
        </label>

        <div className="catalog-filters">
          <FilterButton active={filterStatus.matches(readStates.All.code)} label="All" onClick={() => applyFilter(readStates.All)} />
          <FilterButton active={filterStatus.matches(readStates.Read.code)} label="Read" onClick={() => applyFilter(readStates.Read)} />
          <FilterButton active={filterStatus.matches(readStates.Reading.code)} label="Reading" onClick={() => applyFilter(readStates.Reading)} />
          <FilterButton active={filterStatus.matches(readStates.ToRead.code)} label="To Read" onClick={() => applyFilter(readStates.ToRead)} />
          <FilterButton active={filterStatus.matches(readStates.WontRead.code)} label="Won't Read" onClick={() => applyFilter(readStates.WontRead)} />
          <FilterButton active={filterStatus.matches(readStates.Unknown.code)} label="Unknown" onClick={() => applyFilter(readStates.Unknown)} />
        </div>

        <div className="catalog-results-meta">
          <p>
            Showing {pageStart}-{pageEnd} of {catalogPage.filteredBooks} matching books
          </p>
          {isPending && <span className="catalog-loading-state">Updating…</span>}
        </div>
      </section>

      <section className="catalog-list" aria-live="polite">
        {catalogPage.books.map((book) => (
          <article className={`catalog-row ${getCatalogRowStatusClass(book.ReadStatus)}`} key={book.BookID}>
            <div className="catalog-row-main">
              <div className="catalog-row-titleline">
                <ReadStatusBadge readStatus={book.ReadStatus} />
                <div>
                  <div className="catalog-row-heading">
                    <h2>{book.Title || "Untitled book"}</h2>
                    <span className={`catalog-status-pill ${getCatalogStatusPillClass(book.ReadStatus)}`}>
                      {getCatalogStatusLabel(book.ReadStatus)}
                    </span>
                    <span className="catalog-pages-pill">{book.NrOfPages ? `${book.NrOfPages} pages` : "Page count unknown"}</span>
                    {hasAvailabilityStatus(book.Status) && (
                      <span className="catalog-availability-pill">
                        {book.Status}
                      </span>
                    )}
                  </div>
                  <p>{book.Author || "Unknown author"}</p>
                </div>
              </div>
              <details className="catalog-summary">
                <summary>Summary</summary>
                <p>{book.Description || "No summary available for this book yet."}</p>
              </details>
            </div>
            <div className="catalog-row-side">
              <span className="catalog-book-id">#{book.BookID}</span>
              <Link href={`/book/${book.BookID}`} className="catalog-detail-link">
                Open details
              </Link>
            </div>
          </article>
        ))}

        {catalogPage.books.length === 0 && (
          <div className="catalog-empty">
            <h2>No books match this filter</h2>
            <p>Try a broader search or switch back to a wider read-status filter.</p>
          </div>
        )}
      </section>

      {catalogPage.totalPages > 1 && (
        <nav className="catalog-pagination" aria-label="Catalog pages">
          <button
            type="button"
            className="catalog-page-button"
            disabled={catalogPage.page <= 1 || isPending}
            onClick={() => updateQuery({
              q: deferredSearch.trim(),
              status: getQueryStatusValue(filterStatus),
              page: String(catalogPage.page - 1),
            })}
          >
            Previous
          </button>

          <div className="catalog-page-list">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={pageNumber === catalogPage.page ? "catalog-page-button active" : "catalog-page-button"}
                disabled={pageNumber === catalogPage.page || isPending}
                onClick={() => updateQuery({
                  q: deferredSearch.trim(),
                  status: getQueryStatusValue(filterStatus),
                  page: String(pageNumber),
                })}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="catalog-page-button"
            disabled={catalogPage.page >= catalogPage.totalPages || isPending}
            onClick={() => updateQuery({
              q: deferredSearch.trim(),
              status: getQueryStatusValue(filterStatus),
              page: String(catalogPage.page + 1),
            })}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );

  function applyFilter(nextFilter: ReadStateElement) {
    setFilterStatus(nextFilter);
    updateQuery({
      q: deferredSearch.trim(),
      status: getQueryStatusValue(nextFilter),
      page: "1",
    });
  }
}

function getCatalogRowStatusClass(readStatus?: string): string {
  if (readStates.Read.matches(readStatus)) {
    return "catalog-row-read";
  }

  if (readStates.Reading.matches(readStatus)) {
    return "catalog-row-reading";
  }

  if (readStates.ToRead.matches(readStatus)) {
    return "catalog-row-toread";
  }

  if (readStates.WontRead.matches(readStatus)) {
    return "catalog-row-wontread";
  }

  return "catalog-row-unknown";
}

function getCatalogStatusLabel(readStatus?: string): string {
  if (readStates.Read.matches(readStatus)) {
    return "Read";
  }

  if (readStates.Reading.matches(readStatus)) {
    return "Reading";
  }

  if (readStates.ToRead.matches(readStatus)) {
    return "To Read";
  }

  if (readStates.WontRead.matches(readStatus)) {
    return "Won't Read";
  }

  return "Unknown";
}

function getCatalogStatusPillClass(readStatus?: string): string {
  if (readStates.Read.matches(readStatus)) {
    return "catalog-status-pill-read";
  }

  if (readStates.Reading.matches(readStatus)) {
    return "catalog-status-pill-reading";
  }

  if (readStates.ToRead.matches(readStatus)) {
    return "catalog-status-pill-toread";
  }

  if (readStates.WontRead.matches(readStatus)) {
    return "catalog-status-pill-wontread";
  }

  return "catalog-status-pill-unknown";
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={active ? "catalog-filter active" : "catalog-filter"} onClick={onClick}>
      {label}
    </button>
  );
}

function getReadStateFromQuery(readStatus?: string): ReadStateElement {
  if (!readStatus || readStatus === "all") {
    return readStates.All;
  }

  if (readStates.Read.matches(readStatus)) {
    return readStates.Read;
  }

  if (readStates.Reading.matches(readStatus)) {
    return readStates.Reading;
  }

  if (readStates.ToRead.matches(readStatus)) {
    return readStates.ToRead;
  }

  if (readStates.WontRead.matches(readStatus)) {
    return readStates.WontRead;
  }

  return readStates.Unknown;
}

function getQueryStatusValue(filterStatus: ReadStateElement): string {
  if (filterStatus.matches(readStates.All.code)) {
    return "all";
  }

  if (filterStatus.matches(readStates.Unknown.code)) {
    return "unknown";
  }

  return filterStatus.code;
}

function buildPageNumbers(page: number, totalPages: number): number[] {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages: number[] = [];

  for (let currentPage = start; currentPage <= end; currentPage += 1) {
    pages.push(currentPage);
  }

  return pages;
}

function hasAvailabilityStatus(status?: string): boolean {
  if (!status) {
    return false;
  }

  const normalizedStatus = status.trim().toLocaleLowerCase();
  return normalizedStatus.length > 0 && normalizedStatus !== "n/a";
}
