import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook } from 'src/book';
import { ReadStateElement, ReadStates } from "src/ReadStates";
import { BookService } from 'src/book.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-book-readstatus-updater',
  templateUrl: './book-readstatus-updater.component.html',
  styleUrls: ['./book-readstatus-updater.component.less']
})
export class BookReadstatusUpdaterComponent implements OnInit {

  @Input() book! : IBook;
  readStates : ReadStates = new ReadStates();
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService : ToastService
  ) { 
    
  }
  
  ngOnInit(): void {
  }


  updateStatus(book: IBook, status: ReadStateElement) {
    //TODO: Make a nice confirmation dialog and response messages
    //TODO: The binding is not two way yet
    var bookDisplay = `${book.author} - ${book.title}`;
    if(confirm(`Do you want to change the status for book ${book.bookID}: ${book.author} ${book.title}?\r\nNew status will become: ${status.display} (was: ${book.readStatus})`)) {      
      this.bookService.updateBookReadBadge(book.bookID, status.display).subscribe((r) => {
        if(r) { 
          this.toastService.info(`${bookDisplay} marked with read status: ${status.display}`);
        } else { 
          this.toastService.warn("Could not update the book details!"); 
        }
      });
    }
  }
}
