import { NextRequest, NextResponse } from 'next/server';
import { IBookDetailUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { requireApiSession, revalidateBookCache } from '../../../../../lib/apihelpers';

function parseBookId(bookId: string): number | null {
  const parsed = Number.parseInt(bookId, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const unauthorized = await requireApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const bookId = parseBookId(params.bookId);

  if (!bookId) {
    return NextResponse.json({ error: 'Invalid book id' }, { status: 400 });
  }

  const book = await new BookRepository().getBook(bookId);

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json(book, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const unauthorized = await requireApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const bookId = parseBookId(params.bookId);

  if (!bookId) {
    return NextResponse.json({ error: 'Invalid book id' }, { status: 400 });
  }

  const formData: IBookDetailUpdateModel = await req.json();
  const updateModel = { ...formData, BookID: bookId };
  await new BookRepository().updateDetails(updateModel);
  revalidateBookCache(bookId);

  return NextResponse.json(updateModel, { status: 200 });
}
