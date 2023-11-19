import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookDetailUpdateModel, IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';

// TODO: Handle auth


// Handles POST requests to /api/books/all
export async function GET(
  req: NextRequest
) {
  var books = await new BookRepository().getAllBooks();
  return NextResponse.json(books, { status: 200 });
}