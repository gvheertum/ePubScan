import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IBook, IBookReadStatusUpdateModel } from 'src/book';
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
    private bookService : BookService
  ) { }

  ngOnInit(): void {
    this.readStatusForm.patchValue(this.book);
  }
  
  updateData() : void { 
    var formData = this.readStatusForm.value;
    var updatedData : IBookReadStatusUpdateModel = {  
      bookID: this.book.bookID,
      readRemark: formData.readRemark,
      readStatus: formData.readStatus
    };
    console.debug("Sending: ", updatedData);

    this.bookService.updateBookReadStatus(updatedData).subscribe((r) => {
      if(r) { 
        alert("The readstatus was changed!");
      } else { 
        alert("Could not update the book readstatus!"); 
      }});
  }
}
