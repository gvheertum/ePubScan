import IBook from "./IBook";
import prisma from './prisma';

export default class BookRepository {

    async getAllBooks() : Promise<IBook[]> {
        var feed : IBook[] = await prisma.book.findMany({});
        return feed;
    }

    async getBook(bookID : number) :  Promise<IBook> {
        var book : IBook = await prisma.book.findFirst({where: {
            BookID: bookID,
          }});
        return book;        
    }

}