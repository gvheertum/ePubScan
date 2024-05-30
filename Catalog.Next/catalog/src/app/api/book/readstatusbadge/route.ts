import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';


// Handles POST requests to /api/book/readstatusbadge
export async function POST(
  req: NextRequest
) {
  const session = await getSession();
  if(!session || !session.user) { return NextResponse.json({}, { status: 500, statusText: "No auth!"}) }
  console.log("Session:", session.user);
   
  const formData: IBookReadBadgeUpdateModel = await req.json();
  await new BookRepository().updateBookReadBadge(formData);
  return NextResponse.json(formData, { status: 200 });
}
