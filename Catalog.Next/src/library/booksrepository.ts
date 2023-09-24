import { IBook } from "./book";

export default class BooksRepository {
    async getAllBooks() : Promise<IBook[]> { 

        const res = await fetch('https://books-api.heertum.net/api/Books/All')
        const repo = await res.json()
        return repo;
    }
}