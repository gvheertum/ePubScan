import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IBook } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-availabilitystatus',
  templateUrl: './book-detail-availabilitystatus.component.html',
  styleUrls: ['./book-detail-availabilitystatus.component.less']
})
export class BookDetailAvailabilitystatusComponent implements OnInit {
  @Input() book!: IBook;

  availabilityStatusForm = new FormGroup({
    status: new FormControl(''),
    statusRemark: new FormControl(''),
  });

  constructor(
    bookService : BookService
  ) { }

  ngOnInit(): void {
    this.availabilityStatusForm.patchValue(this.book);
  }
  
  updateData() : void {
    alert("Not yet implemented");
  }
}
