import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html'
})
export class BooksComponent {
  public books: IBook[];
  public selectedBook : IBook;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<IBook[]>(baseUrl + 'api/Books/All').subscribe(result => {
      this.books = result;
    }, error => console.error(error));
  }
}