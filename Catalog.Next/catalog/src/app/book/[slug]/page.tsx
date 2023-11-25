import { signOut, useSession } from "next-auth/react";
import BookDetail from "../../../../components/bookdetail";
import BookRepository from "../../../../lib/bookrepository"

import Header from "../../../../components/header";


export default async function Book({ params }: { params: { slug: string } }) {
    //new Util().logLine("looking for post:" + params.slug);
    //var post: IPost = new PostRepository().getPost(params.slug);

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
