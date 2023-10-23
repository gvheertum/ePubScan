import IBook from "../lib/IBook"

export default function BookDetail({
  book,
}: {
  book?: IBook
}) {
  return <>
      <div>{book?.BookID}</div>
      <div>{book?.Author}</div>
      <div>{book?.Title}</div>
      <div>{book?.NrOfPages}</div>
    </>
}