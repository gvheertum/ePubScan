import Link from "next/link"
import IBook from "../lib/IBook"
import "./bookcard.css"
export default function BookCard({
  book,
}: {
  book?: IBook
}) {
  return <div className="card">
    <h3>{book?.Author} - {book?.Title}</h3>
    <p>
      {book?.Description}
    </p>
    <Link href={"/book/" + book?.BookID}>
      View Details
    </Link>
  </div>

}