import BookDetail from "../../../../components/bookdetail";
import BookRepository from "../../../../lib/bookrepository"

export default async function Book({ params }: { params: { slug: string } }) {
    //new Util().logLine("looking for post:" + params.slug);
    //var post: IPost = new PostRepository().getPost(params.slug);
    let book = await new BookRepository().getBook(parseInt(params.slug, 10));
    return <>
        <h1>Book detail</h1>
        {book !== null && 
        <BookDetail book={book!} /> 
        }
        {book === null && 
            <p>No book!</p>
        }
    </>
 }