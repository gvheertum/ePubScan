import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.less']
})
export class BookListComponent implements OnInit {
  books? : IBook[];
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private location: Location
  ) { 
    route.params.subscribe(val => {
      this.getBooks();
    });
  }

  ngOnInit(): void {
  }

  getBooks() : void {
    const status = this.route.snapshot.paramMap.get('status');
    console.log(`statusFilter:${status}`)
    this.bookService.getBooks().subscribe(b => { this.books = this.filterBooks(b, status); });
  }

  filterBooks(books: IBook[], status: string | null) : IBook[] {
    console.log(`Starting filter: ${status}`);
    if(!status) {
      console.log("No filter, here is the whole list!");
      return books; 
    }

    let matchingBooks = new Array<IBook>();
    for(let b of books) {
      if(b.readStatus?.toLocaleLowerCase() == status?.toLocaleLowerCase()) { matchingBooks.push(b); }
    }
    console.log(`Kept ${matchingBooks.length} of ${books.length}`);
    return matchingBooks;
  }
}
