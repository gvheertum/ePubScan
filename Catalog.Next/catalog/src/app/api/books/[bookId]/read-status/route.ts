import { NextRequest, NextResponse } from 'next/server';
import { IBookReadStatusUpdateModel } from '../../../../../../lib/IBook';
import BookRepository from '../../../../../../lib/bookrepository';
import { requireApiSession, revalidateBookCache } from '../../../../../../lib/apihelpers';

function parseBookId(bookId: string): number | null {
  const parsed = Number.parseInt(bookId, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
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

  const formData: IBookReadStatusUpdateModel = await req.json();
  const updateModel = { ...formData, BookID: bookId };
  await new BookRepository().updateReadStatus(updateModel);
  revalidateBookCache(bookId);

  return NextResponse.json(updateModel, { status: 200 });
}
