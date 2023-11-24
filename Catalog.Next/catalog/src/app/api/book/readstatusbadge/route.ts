import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { auth } from '../../../../../auth';

// Handles POST requests to /api/book/readstatusbadge
export async function POST(
  req: NextRequest
) {
  if(!(await auth())) { return NextResponse.json("No access", {status: 403}); }
   
  const formData: IBookReadBadgeUpdateModel = await req.json();
  await new BookRepository().updateBookReadBadge(formData);
  return NextResponse.json(formData, { status: 200 });
}
