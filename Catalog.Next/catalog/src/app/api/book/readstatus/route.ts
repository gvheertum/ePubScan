import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { getSession } from '@auth0/nextjs-auth0';


// Handles POST requests to /api/book/readstatus
export async function POST(
  req: NextRequest
) {
  const session = await getSession();
  if(!session || !session.user) { return NextResponse.json({}, { status: 500, statusText: "No auth!"}) }
  console.log("Session:", session.user);

  const formData: IBookReadStatusUpdateModel = await req.json();
  await new BookRepository().updateReadStatus(formData);
  return NextResponse.json(formData, { status: 200 });
}
