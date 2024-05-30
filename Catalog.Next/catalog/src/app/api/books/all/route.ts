import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookDetailUpdateModel, IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { getSession } from '@auth0/nextjs-auth0';



// Handles POST requests to /api/books/all
export async function GET(
  req: NextRequest
) {  
  const session = await getSession();
  if(!session || !session.user) { return NextResponse.json({}, { status: 403, statusText: "No auth!"}) }
  console.log("Session:", session.user);
  var books = await new BookRepository().getAllBooks();
  return NextResponse.json(books, { status: 200 });
  
}