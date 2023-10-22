import Image from 'next/image'
import prisma from '../../lib/prisma';
import BookRepository from '../../lib/bookrepository';
import IBook from '../../lib/IBook';



export default async function Home() {
  var feed = await new BookRepository().getAllBooks();
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     
            {feed.map((b: IBook,i) => {
              return (<p key={i}>{b.BookID}: {b.Title} {b.Author} - {b.NrOfPages}</p>)
            }
            )}
    </main>
  )
}
