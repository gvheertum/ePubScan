import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';
import { Title } from '@angular/platform-browser';
import { Settings } from 'src/settings';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.less']
})
export class BookListComponent implements OnInit {
  books? : IBook[];
  allBooks? : IBook[];
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private titleService: Title,
    private settings : Settings
  ) { 
    route.params.subscribe(val => {
      this.getBooks();
    });
  }

  ngOnInit(): void {
  }

  getBooks() : void {
    // Get the status, if status is all reset to empty
    let status = this.route.snapshot.paramMap.get('status');
    if(status?.toLowerCase() == "all") { status = null; }

    // Get the books and filter if applicable
    console.debug(`statusFilter:${status}`);
    this.titleService.setTitle(`${status ?? "All books"} | ${this.settings.getApplicationTitle()}`);
    if(!this.allBooks) {
      console.debug("Retrieving full list, nothing in memory");
      this.bookService.getBooks().subscribe(b => { 
        console.debug("Retrieved booklist");
        this.allBooks = b;
        this.books = this.filterBooks(this.allBooks, status); 
      });      
    } else {
      console.debug("Already have a list of books, using in-mem filter");
      this.books = this.filterBooks(this.allBooks, status);
    }
  }

  filterBooks(books: IBook[], status: string | null) : IBook[] {
    console.debug(`Starting filter: ${status}`);
    if(!status) {
      console.debug("No filter, here is the whole list!");
      return books; 
    }

    let matchingBooks = new Array<IBook>();
    for(let b of books) {
      if(b.readStatus?.toLocaleLowerCase() == status?.toLocaleLowerCase()) { matchingBooks.push(b); }
    }
    console.debug(`Kept ${matchingBooks.length} of ${books.length}`);
    return matchingBooks;
  }
}
