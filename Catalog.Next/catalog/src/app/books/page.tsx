import BookCard from "../../../components/bookcard";
import IBook from "../../../lib/IBook";
import BookRepository from "../../../lib/bookrepository"

export default async function BookOverview() {
    let books = await new BookRepository().getAllBooks();

    return <section className="bg-gray-2 dark:bg-dark pt-20 pb-10 lg:pt-[120px] lg:pb-20">
            <div className="container mx-auto">
                <div className="flex flex-wrap -mx-4">

                    {books.map((b: IBook, i) => {
                        return (<><BookCard book={b} /></>)
                    }
                    )}
                </div>
            </div>
        </section>
}