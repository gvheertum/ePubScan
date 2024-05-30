import BookDetail from "../../../../components/bookdetail";
import BookRepository from "../../../../lib/bookrepository"

import Header from "../../../../components/header";
import Head from "next/head";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    let book = await new BookRepository().getBook(parseInt(params.slug, 10));
    
    const bookTitle = !!book ? `${book.Title} - ${book.Author}` : "Unknown";

    return {
      title: `${bookTitle} - Bookcatalog`,
    };
  }

export default async function Book({ params }: { params: { slug: string } }) {


    let book = await new BookRepository().getBook(parseInt(params.slug, 10));
    return <>

        <Header />

        <h1>Book detail</h1>
        {book !== null &&
            <BookDetail book={book!} />
        }
        {book === null &&
            <p>No book with this ID!</p>
        }
    </>

}
