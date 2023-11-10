import { IBook, IBookAvailabilityStatusUpdateModel, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel, IBookUpdateModel } from "./IBook";
import prisma from './prisma';

export default class BookRepository {

  async getAllBooks(): Promise<IBook[]> {
    var feed: IBook[] = (await prisma.book.findMany({})).sort((a,b) => a.BookID - b.BookID);
    return feed;
  }

  async getBook(bookID: number): Promise<IBook | null> {
    console.log("bookid:", bookID);
    let book: IBook | null = await prisma.book.findFirst({
      where: {
        BookID: bookID,
      }
    });
    return book;
  }

  async updateBookReadBadge(updateModel: IBookReadBadgeUpdateModel): Promise<boolean> {
    return await this.coreUpdateFunction(updateModel);
  }

  async updateReadStatus(updateModel: IBookReadStatusUpdateModel): Promise<boolean> {
    return await this.coreUpdateFunction(updateModel);
  }

  async updateAvailability(updateModel: IBookAvailabilityStatusUpdateModel): Promise<boolean> {
    return await this.coreUpdateFunction(updateModel);
  }

  async updateDetails(updateModel: IBookDetailUpdateModel): Promise<boolean> {
    return await this.coreUpdateFunction(updateModel);
  }

  private async coreUpdateFunction(updateModel: IBookUpdateModel): Promise<boolean> {

    const { BookID, ...properties } = updateModel; //Explode into the ID and rest
    console.log("Update exploded: ", BookID, properties);

    //Update and profit!
    await prisma.book.update({
      where: { BookID: BookID },
      data: properties
    });
    return true;
  }

}