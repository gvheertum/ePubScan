import Link from "next/link"
import IBook from "../lib/IBook"
import "./bookcard.css"
export default function BookCard({
  book,
}: {
  book?: IBook
}) {
  return <div className="w-full px-4 md:w-1/2 xl:w-1/3">
      <div className="mb-10 overflow-hidden duration-300 bg-white rounded-lg dark:bg-dark-2 shadow-1 hover:shadow-3 dark:shadow-card dark:hover:shadow-3">
        <div className="p-8 text-center sm:p-9 md:p-7 xl:p-9">
          <h3>
            <a className="text-dark dark:text-black hover:text-primary mb-4 block text-xl font-semibold sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]" >
              {book?.Author} - {book?.Title}
            </a>
            
          </h3>
          <p
            className="text-base leading-relaxed text-body-color dark:text-dark-6 mb-7"
          >
            {book?.Description}
          </p>
          <Link href={"/book/" + book?.BookID} className="inline-block py-2 text-base font-medium transition border rounded-full text-body-color hover:border-primary hover:bg-primary border-gray-3 px-7 hover:text-white dark:border-dark-3 dark:text-dark-6">
            View Details
          </Link>
        </div>
      </div>
    </div>

}