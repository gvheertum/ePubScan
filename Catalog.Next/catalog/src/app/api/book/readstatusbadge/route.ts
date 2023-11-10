import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';

// Handles POST requests to /api/book/readstatus
export async function POST(
  req: NextRequest
) {
  console.log("got api request");
  const formData: IBookReadBadgeUpdateModel = await req.json();
  await new BookRepository().updateBookReadBadge(formData);
  return NextResponse.json(formData, { status: 200 });
}
