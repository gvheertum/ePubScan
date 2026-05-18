import Header from "../../../components/header";
import BookCatalogClient from "../../../components/bookcatalogclient";
import BookRepository from "../../../lib/bookrepository";
import "./books.css"
export default async function BookOverview() {
    const books = await new BookRepository().getBookCatalog();

    return <>
        <Header />
        <main className="page-container">
            <BookCatalogClient initialBooks={books} />
        </main>
    </>
}
