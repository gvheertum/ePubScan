
import BooksRepository from '@/library/booksrepository';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Handles POST requests to /api
export async function GET(
  req: NextRequest
) {

   var res = await new BooksRepository().getAllBooks();
   return NextResponse.json({ "data": res }, {status: true ? 200 : 500});

//     return { props: { repo } }

//   const formData /*: ContactFormData */= await req.json();

//     console.log("It works");
//     return NextResponse.json({ "bliep": "bloep" }, {status: true || formData.success ? 200 : 500});
}
 