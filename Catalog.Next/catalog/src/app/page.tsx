import Image from 'next/image'
import prisma from '../../lib/prisma';
import { GetStaticProps } from 'next';

class Book {
  BookID: number;
  ReadStatus?: string;
  ReadRemark?: string;
  Title?: string;
  Author?: string;
  Identifier?: string;
  Language?: string;
  Category?: string;
  Subject?: string;
  Description?: string;
  Folder?: string;
  FileName?: string;
  Status?: string;
  StatusRemark?: string;
  Medium?: string;
  NrOfPages?: number;
}

export default async function Home() {
  const feed : Book[] = await prisma.book.findMany({});
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            {feed.map((b: Book,i) => {
              return (<h1 key={i}>{b.Title} {b.Author} - {b.NrOfPages}</h1>)
            }
            )}
      </div>
    </main>
  )
}
