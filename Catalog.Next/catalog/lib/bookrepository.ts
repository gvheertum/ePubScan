import { unstable_cache } from "next/cache";
import { IBook, IBookAvailabilityStatusUpdateModel, IBookCatalogItem, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel, IBookUpdateModel } from "./IBook";
import prisma from './prisma';

const getCatalogBooksCached = unstable_cache(
  async (): Promise<IBookCatalogItem[]> => {
    return await prisma.book.findMany({
      select: {
        BookID: true,
        Title: true,
        Author: true,
        ReadStatus: true,
        Medium: true,
        Status: true,
        NrOfPages: true,
      },
      orderBy: {
        BookID: 'desc',
      },
    }) as IBookCatalogItem[];
  },
  ['book-catalog'],
  {
    revalidate: 300,
    tags: ['books'],
  }
);

function getBookCached(bookID: number) {
  return unstable_cache(
    async (): Promise<IBook | null> => {
      return await prisma.book.findUnique({
        where: {
          BookID: bookID,
        },
      }) as IBook | null;
    },
    ['book-detail', String(bookID)],
    {
      revalidate: 300,
      tags: ['books', `book:${bookID}`],
    }
  )();
}

function sanitizeUpdateData<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

export default class BookRepository {

  async getBookCatalog(): Promise<IBookCatalogItem[]> {
    return await getCatalogBooksCached();
  }

  async getBook(bookID: number): Promise<IBook | null> {
    return await getBookCached(bookID);
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
    if (!BookID) {
      return false;
    }

    //Update and profit!
    await prisma.book.update({
      where: { BookID: BookID },
      data: sanitizeUpdateData(properties)
    });
    return true;
  }

}
