import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    bookID: new FormControl(''),
    identifier: new FormControl(''),
    title: new FormControl(''),
    author: new FormControl(''),
    description: new FormControl(''),
    medium: new FormControl(''),
    nrOfPages: new FormControl(''),
  });

  constructor(
    private bookService : BookService
  ) { }

  ngOnInit(): void {
    this.bookDetailForm.patchValue(this.book);
  }

  updateData() : void {
    //TODO: Find a way to reverse patch the data
    var formData = this.bookDetailForm.value;
    var updatedData : IBookDetailUpdateModel = {  
      bookID: this.book.bookID,
      identifier: formData.identifier,
      title: formData.title,
      author: formData.author,
      description: formData.description,
      medium: formData.medium,
      nrOfPages: formData.nrOfPages
    };
    console.debug("Sending: ", updatedData);

    this.bookService.updateBookDetails(updatedData).subscribe((r) => {
      if(r) { 
        alert("The detail was changed!");
      } else { 
        alert("Could not update the book detail!"); 
      }});
  }
}
