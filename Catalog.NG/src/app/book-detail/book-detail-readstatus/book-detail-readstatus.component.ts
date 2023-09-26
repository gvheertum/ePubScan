import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/toast/toast.service';
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
    private bookService : BookService,
    private toastService : ToastService
  ) { }

  ngOnInit(): void {
    this.readStatusForm.patchValue(this.book);
  }
  
  updateData() : void { 
    var formData = this.readStatusForm.value;
    var updatedData : IBookReadStatusUpdateModel = {  
      BookID: this.book.BookID,
      ReadRemark: formData.readRemark,
      ReadStatus: formData.readStatus
    };
    console.debug("Sending: ", updatedData);

    this.bookService.updateBookReadStatus(updatedData).subscribe((r) => {
      if(r) { 
        this.toastService.info("The readstatus was changed!");
      } else { 
        this.toastService.warn("Could not update the book readstatus!"); 
      }});
  }
}
