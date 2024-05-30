import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookDetailUpdateModel, IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { getSession } from '@auth0/nextjs-auth0';


// Handles POST requests to /api/book/details
export async function POST(
  req: NextRequest
) {
  const session = await getSession();
  if(!session || !session.user) { return NextResponse.json({}, { status: 500, statusText: "No auth!"}) }
  console.log("Session:", session.user);

  const formData: IBookDetailUpdateModel = await req.json();
  await new BookRepository().updateDetails(formData);
  return NextResponse.json(formData, { status: 200 });
}