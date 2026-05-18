import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import BookRepository from '../../../../../lib/bookrepository';
import { getSession } from '@auth0/nextjs-auth0';



// Handles POST requests to /api/books/all
export async function GET(
  req: NextRequest
) {  
  const session = await getSession();
  if(!session || !session.user) { return NextResponse.json({}, { status: 403, statusText: "No auth!"}) }
  const books = await new BookRepository().getBookCatalog();
  return NextResponse.json(books, { status: 200 });
  
}
