import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/toast/toast.service';
import { IBook, IBookDetailUpdateModel } from 'src/book';
import { BookService } from 'src/book.service';

@Component({
  selector: 'app-book-detail-general',
  templateUrl: './book-detail-general.component.html',
  styleUrls: ['./book-detail-general.component.less']
})
export class BookDetailGeneralComponent implements OnInit {
  @Input() book!: IBook;

  bookDetailForm = new FormGroup({
    BookID: new FormControl(''),
    Identifier: new FormControl(''),
    Title: new FormControl(''),
    Author: new FormControl(''),
    Description: new FormControl(''),
    Medium: new FormControl(''),
    NrOfPages: new FormControl(''),
  });

  constructor(
    private bookService : BookService,
    private toastService : ToastService
  ) { }

  ngOnInit(): void {
    this.bookDetailForm.patchValue(this.book);
  }

  updateData() : void {
    //TODO: Find a way to reverse patch the data
    var formData = this.bookDetailForm.value;
    var updatedData : IBookDetailUpdateModel = {  
      BookID: this.book.BookID,
      Identifier: formData.Identifier,
      Title: formData.Title,
      Author: formData.Author,
      Description: formData.Description,
      Medium: formData.Medium,
      NrOfPages: formData.NrOfPages
    };
    console.debug("Sending: ", updatedData);

    this.bookService.updateBookDetails(updatedData).subscribe((r) => {
      if(r) { 
        this.toastService.info("The detail was changed!");
      } else { 
        this.toastService.error("Could not update the book detail!"); 
      }});
  }
}
