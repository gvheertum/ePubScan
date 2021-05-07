import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.less']
})
export class BookDetailComponent implements OnInit {
  book? : IBook;
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private location: Location

  ) { 
    route.params.subscribe(val => {
      this.getBook();
    });
   }

  ngOnInit(): void {
    
  }
  
  goBack(): void {
    this.location.back();
  }

  getBook() : void {
    const bookId = Number(this.route.snapshot.paramMap.get('bookid'));
    this.bookService.getBook(bookId).subscribe(b => this.book = b);
  }
}