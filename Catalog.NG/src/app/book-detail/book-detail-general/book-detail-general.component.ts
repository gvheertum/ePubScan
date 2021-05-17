import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-general',
  templateUrl: './book-detail-general.component.html',
  styleUrls: ['./book-detail-general.component.less']
})
export class BookDetailGeneralComponent implements OnInit {
  @Input() book!: IBook;

  bookDetailForm = new FormGroup({
    bookID: new FormControl(''),
    identifier: new FormControl(''),
    title: new FormControl(''),
    author: new FormControl(''),
    description: new FormControl(''),
    medium: new FormControl(''),
    nrOfPages: new FormControl(''),
  });

  constructor(
    bookService : BookService
  ) { }

  ngOnInit(): void {
    this.bookDetailForm.patchValue(this.book);
  }

  updateData() : void {
    alert("Not yet implemented");
  }
}
