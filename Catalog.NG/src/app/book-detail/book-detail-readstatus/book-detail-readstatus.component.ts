import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-readstatus',
  templateUrl: './book-detail-readstatus.component.html',
  styleUrls: ['./book-detail-readstatus.component.less']
})

export class BookDetailReadstatusComponent implements OnInit {
  @Input() book!: IBook;

  readStatusForm = new FormGroup({
    readRemark: new FormControl(''),
    readStatus: new FormControl(''),
  });

  constructor(
    bookService : BookService
  ) { }

  ngOnInit(): void {
    this.readStatusForm.patchValue(this.book);
  }
  updateData() : void {
    alert("Not yet implemented");
  }
}
