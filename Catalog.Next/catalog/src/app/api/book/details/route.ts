import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookDetailUpdateModel, IBookReadBadgeUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';

// Handles POST requests to /api/book/details
export async function POST(
  req: NextRequest
) {
  const formData: IBookDetailUpdateModel = await req.json();
  await new BookRepository().updateDetails(formData);
  return NextResponse.json(formData, { status: 200 });
}