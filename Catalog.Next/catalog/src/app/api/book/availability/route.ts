import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { IBookAvailabilityStatusUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { getSession } from '@auth0/nextjs-auth0';


// Handles POST requests to /api/book/availability
export async function POST(
  req: NextRequest
) {
  const session = await getSession();
  if(!session || !session.user) { return NextResponse.json({}, { status: 500, statusText: "No auth!"}) }

  const formData: IBookAvailabilityStatusUpdateModel = await req.json();
  await new BookRepository().updateAvailability(formData);
  if (formData.BookID) {
    revalidateTag('books');
    revalidateTag(`book:${formData.BookID}`);
  }
  return NextResponse.json(formData, { status: 200 });
}
