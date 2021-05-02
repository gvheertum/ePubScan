import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-availabilitystatus',
  templateUrl: './book-detail-availabilitystatus.component.html',
  styleUrls: ['./book-detail-availabilitystatus.component.less']
})
export class BookDetailAvailabilitystatusComponent implements OnInit {
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
