import BookDetail from "../../../../components/bookdetail";
import BookRepository from "../../../../lib/bookrepository"
import Header from "../../../../components/header";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const bookId = parseInt(params.slug, 10);
    const book = await new BookRepository().getBook(bookId);
    
    const bookTitle = !!book ? `${book.Title} - ${book.Author}` : "Unknown";

    return {
      title: `${bookTitle} - Bookcatalog`,
    };
  }

export default async function Book({ params }: { params: { slug: string } }) {
    const bookId = parseInt(params.slug, 10);
    const book = await new BookRepository().getBook(bookId);
    return <>

        <Header />

        <main className="page-container">
            {book !== null &&
                <BookDetail book={book} />
            }
            {book === null &&
                <section className="catalog-empty">
                    <h1>Book not found</h1>
                    <p>No book with ID {bookId} exists in the catalog.</p>
                </section>
            }
        </main>
    </>

}
