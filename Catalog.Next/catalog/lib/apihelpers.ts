import { getSession } from '@auth0/nextjs-auth0';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function requireApiSession() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({}, { status: 403, statusText: 'No auth!' });
  }

  return null;
}

export function revalidateBookCache(bookId?: number) {
  revalidateTag('books');

  if (bookId) {
    revalidateTag(`book:${bookId}`);
  }
}
