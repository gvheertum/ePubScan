import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-readstatus',
  templateUrl: './book-detail-readstatus.component.html',
  styleUrls: ['./book-detail-readstatus.component.less']
})
export class BookDetailReadstatusComponent implements OnInit {
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
