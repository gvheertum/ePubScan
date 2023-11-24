import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookDetailUpdateModel, IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { auth } from '../../../../../auth';

// TODO: Handle auth


// Handles POST requests to /api/books/all
export async function GET(
  req: NextRequest
) {  
  if(!(await auth())) { return NextResponse.json("No access", {status: 403}); }

  var books = await new BookRepository().getAllBooks();
  return NextResponse.json(books, { status: 200 });
  
}