import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookAvailabilityStatusUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';

// Handles POST requests to /api/book/availability
export async function POST(
  req: NextRequest
) {
  const formData: IBookAvailabilityStatusUpdateModel = await req.json();
  await new BookRepository().updateAvailability(formData);
  return NextResponse.json(formData, { status: 200 });
}
