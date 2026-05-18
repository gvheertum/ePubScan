import { NextResponse } from 'next/server';
import BookRepository from '../../../../lib/bookrepository';
import { requireApiSession } from '../../../../lib/apihelpers';

export async function GET() {
  const unauthorized = await requireApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const books = await new BookRepository().getBookCatalog();
  return NextResponse.json(books, { status: 200 });
}
