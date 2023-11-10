import BookCard from "../../../components/bookcard";
import { IBook } from "../../../lib/IBook";
import BookRepository from "../../../lib/bookrepository"

export default async function BookOverview() {
    let books = await new BookRepository().getAllBooks();

    return <>
                    {books.map((b: IBook, i) => {
                        return (<><BookCard book={b} /></>)
                    }
                    )}
          </>
}