import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { IBookAvailabilityStatusUpdateModel } from '../../../../../lib/IBook';
import BookRepository from '../../../../../lib/bookrepository';
import { auth } from '../../../../../auth';

// Handles POST requests to /api/book/availability
export async function POST(
  req: NextRequest
) {
  if(!(await auth())) { return NextResponse.json("No access", {status: 403}); }

  const formData: IBookAvailabilityStatusUpdateModel = await req.json();
  await new BookRepository().updateAvailability(formData);
  return NextResponse.json(formData, { status: 200 });
}
