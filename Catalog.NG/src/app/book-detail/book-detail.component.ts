import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Settings } from 'src/settings';

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
    private router: Router,
    private location: Location,
    private titleService: Title,
    private settings : Settings
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
    this.bookService.getBook(bookId).subscribe(b => { 
      this.book = b;
      this.titleService.setTitle(`${b.title} - ${b.author} | ${this.settings.getApplicationTitle()}`);
    });
  }
}
