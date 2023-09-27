import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/toast/toast.service';
import { IBook, IBookAvailabilityStatusUpdateModel } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-availabilitystatus',
  templateUrl: './book-detail-availabilitystatus.component.html',
  styleUrls: ['./book-detail-availabilitystatus.component.less']
})
export class BookDetailAvailabilitystatusComponent implements OnInit {
  @Input() book!: IBook;

  availabilityStatusForm = new FormGroup({
    Status: new FormControl(''),
    StatusRemark: new FormControl(''),
  });

  constructor(
    private bookService : BookService,
    private toastService : ToastService
  ) { }

  ngOnInit(): void {
    this.availabilityStatusForm.patchValue(this.book);
  }
  
  updateData() : void {
    var formData = this.availabilityStatusForm.value;
    var updatedData : IBookAvailabilityStatusUpdateModel = {  
      BookID: this.book.BookID,
      Status: formData.Status,
      StatusRemark: formData.StatusRemark
    };
    console.debug("Sending: ", updatedData);

    this.bookService.updateBookAvailabilityStatus(updatedData).subscribe((r) => {
      if(r) { 
        this.toastService.info("The availability was changed!");
      } else { 
        this.toastService.warn("Could not update the book availability!"); 
      }});
  }
}
