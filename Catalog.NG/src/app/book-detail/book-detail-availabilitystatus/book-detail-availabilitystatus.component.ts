import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    status: new FormControl(''),
    statusRemark: new FormControl(''),
  });

  constructor(
    private bookService : BookService
  ) { }

  ngOnInit(): void {
    this.availabilityStatusForm.patchValue(this.book);
  }
  
  updateData() : void {
    var formData = this.availabilityStatusForm.value;
    var updatedData : IBookAvailabilityStatusUpdateModel = {  
      bookID: this.book.bookID,
      status: formData.status,
      statusRemark: formData.statusRemark
    };
    console.debug("Sending: ", updatedData);

    this.bookService.updateBookAvailabilityStatus(updatedData).subscribe((r) => {
      if(r) { 
        alert("The availability was changed!");
      } else { 
        alert("Could not update the book availability!"); 
      }});
  }
}
