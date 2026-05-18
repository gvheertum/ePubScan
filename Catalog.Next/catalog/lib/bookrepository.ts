import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { IBook, IBookAvailabilityStatusUpdateModel, IBookCatalogItem, IBookCatalogPage, IBookCatalogQuery, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel, IBookUpdateModel } from "./IBook";
import prisma from './prisma';

const getCatalogBooksCached = unstable_cache(
  async (): Promise<IBookCatalogItem[]> => {
    return await prisma.book.findMany({
      select: {
        BookID: true,
        Title: true,
        Author: true,
        ReadStatus: true,
        Description: true,
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

const knownReadStatuses = {
  read: ["read", "Read"],
  reading: ["reading", "Reading"],
  toread: ["toread", "To Read"],
  notgoingtoread: ["notgoingtoread", "Not going to read"],
} as const;

function buildReadStatusWhere(readStatus?: string): Prisma.BookWhereInput | undefined {
  const normalizedStatus = readStatus?.trim().toLocaleLowerCase();

  if (!normalizedStatus || normalizedStatus === "all") {
    return undefined;
  }

  if (normalizedStatus === "unknown") {
    return {
      NOT: {
        OR: Object.values(knownReadStatuses).flatMap((values) =>
          values.map((value) => ({
            ReadStatus: { equals: value, mode: Prisma.QueryMode.insensitive },
          }))
        ),
      },
    };
  }

  const matchingValues =
    knownReadStatuses[normalizedStatus as keyof typeof knownReadStatuses] ??
    [readStatus ?? normalizedStatus];

  return {
    OR: matchingValues.map((value) => ({
      ReadStatus: { equals: value, mode: Prisma.QueryMode.insensitive },
    })),
  };
}

function buildBookCatalogWhere(search?: string, readStatus?: string): Prisma.BookWhereInput {
  const normalizedSearch = search?.trim();
  const filters: Prisma.BookWhereInput[] = [];
  const readStatusFilter = buildReadStatusWhere(readStatus);

  if (readStatusFilter) {
    filters.push(readStatusFilter);
  }

  if (normalizedSearch) {
    filters.push({
      OR: [
        { Title: { contains: normalizedSearch, mode: Prisma.QueryMode.insensitive } },
        { Author: { contains: normalizedSearch, mode: Prisma.QueryMode.insensitive } },
        { Medium: { contains: normalizedSearch, mode: Prisma.QueryMode.insensitive } },
        { Status: { contains: normalizedSearch, mode: Prisma.QueryMode.insensitive } },
      ],
    });
  }

  return filters.length > 0 ? { AND: filters } : {};
}

export default class BookRepository {

  async getBookCatalog(): Promise<IBookCatalogItem[]> {
    return await getCatalogBooksCached();
  }

  async getBook(bookID: number): Promise<IBook | null> {
    return await getBookCached(bookID);
  }

  async getBookCatalogPage(query: IBookCatalogQuery): Promise<IBookCatalogPage> {
    const pageSize = Math.max(1, query.pageSize);
    const requestedPage = Math.max(1, query.page);
    const where = buildBookCatalogWhere(query.search, query.readStatus);

    const [totalBooks, filteredBooks, readBooks, readingBooks] = await prisma.$transaction([
      prisma.book.count(),
      prisma.book.count({ where }),
      prisma.book.count({ where: buildReadStatusWhere("read") }),
      prisma.book.count({ where: buildReadStatusWhere("reading") }),
    ]);

    const totalPages = Math.max(1, Math.ceil(filteredBooks / pageSize));
    const page = Math.min(requestedPage, totalPages);
    const books = await prisma.book.findMany({
      select: {
        BookID: true,
        Title: true,
        Author: true,
        ReadStatus: true,
        Description: true,
        Medium: true,
        Status: true,
        NrOfPages: true,
      },
      where,
      orderBy: {
        BookID: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      books: books as IBookCatalogItem[],
      totalBooks,
      filteredBooks,
      readBooks,
      readingBooks,
      page,
      pageSize,
      totalPages,
      search: query.search?.trim() || "",
      readStatus: query.readStatus?.trim() || "all",
    };
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
