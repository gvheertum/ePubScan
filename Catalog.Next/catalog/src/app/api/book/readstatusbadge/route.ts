import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { getSession } from '@auth0/nextjs-auth0';


// Handles POST requests to /api/book/readstatusbadge
export async function POST(
  req: NextRequest
) {
  const session = await getSession();
  if(!session || !session.user) { return NextResponse.json({}, { status: 500, statusText: "No auth!"}) }
   
  const formData: IBookReadBadgeUpdateModel = await req.json();
  await new BookRepository().updateBookReadBadge(formData);
  if (formData.BookID) {
    revalidateTag('books');
    revalidateTag(`book:${formData.BookID}`);
  }
  return NextResponse.json(formData, { status: 200 });
}
