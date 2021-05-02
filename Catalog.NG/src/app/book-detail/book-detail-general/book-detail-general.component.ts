import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-general',
  templateUrl: './book-detail-general.component.html',
  styleUrls: ['./book-detail-general.component.less']
})
export class BookDetailGeneralComponent implements OnInit {
  @Input() book!: IBook;

  constructor(
    bookService : BookService
  ) { }

  ngOnInit(): void {
  }
  updateData() : void {
    alert("Not yet implemented");
  }
}
