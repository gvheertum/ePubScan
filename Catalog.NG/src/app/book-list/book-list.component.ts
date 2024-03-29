import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';
import { Title } from '@angular/platform-browser';
import { Settings } from 'src/settings';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.less']
})
export class BookListComponent implements OnInit {
  books? : IBook[];
  allBooks? : IBook[];
  selectedStatus? : string;
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

    this.selectedStatus = status ?? undefined;
    this.loadBookList(this.selectedStatus);
  }

  reloadBookList() {
    this.allBooks = [];
    this.loadBookList(this.selectedStatus);
  }

  loadBookList(status?: string) {
    if(!this.allBooks?.length) {
      // Perform request to fill our cache and perform a filter for ouir display
      this.bookService.getBooks().subscribe(b => { 
        this.allBooks = b.reverse();
        this.books = this.filterBooks(this.allBooks, status); 
      });      
    } else {
      // Cache already present, filter on the current cache
      this.books = this.filterBooks(this.allBooks, status);
    }
  }

  filterBooks(books: IBook[], status?: string) : IBook[] {
    console.debug(`Starting filter: ${status}`);
    
    if(!status) { return books; }
    if(status.toLowerCase() == "newly added") { return this.filterNewlyCreatedBooks(books); }
    return this.filterStatusBooks(books,status);
  }

  //Get books filtered per status
  filterStatusBooks(books: IBook[], status: string | null) : IBook[] {
    let matchingBooks = new Array<IBook>();
    for(let b of books) {
      if(b.ReadStatus?.toLocaleLowerCase() == status?.toLocaleLowerCase()) { matchingBooks.push(b); }
    }
    console.debug(`Kept ${matchingBooks.length} of ${books.length}`);
    return matchingBooks;
  }

  //Get newly created books, these typically dont have a read status and no description or page count
  filterNewlyCreatedBooks(books: IBook[]) : IBook[] {
    console.debug("Filtering newly created")
    let matchingBooks = new Array<IBook>();
    for(let b of books) {
      if(b.BookID >= this.settings.getNewBookOffset() && (!b.NrOfPages || !b.Description)) { matchingBooks.push(b); }
    }
    console.debug(`Kept ${matchingBooks.length} of ${books.length}`);
    return matchingBooks;
  }
    
}
