import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook } from 'src/book';
import { ReadStateElement, ReadStates } from "src/ReadStates";
import { BookService } from 'src/book.service';
import { ToastService } from '../toast/toast.service';
import { ModalService } from '../modal/modal.service';

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
    private toastService : ToastService,
    private modalService : ModalService
  ) { 
    
  }
  
  ngOnInit(): void {
  }


  updateStatus(book: IBook, status: ReadStateElement) {
    
    var bookDisplay = `${book.author} - ${book.title}`;
    var message = `Do you want to change the status for book ${book.bookID}: ${bookDisplay} ${status.display}?\r\nOld state was: ${book.readStatus}`;
    var action = () => {
      this.bookService.updateBookReadBadge(book.bookID, status.display).subscribe((r) => {
        if(r) { 
          this.toastService.info(`${bookDisplay} marked with read status: ${status.display}`);
        } else { 
          this.toastService.warn("Could not update the book details!"); 
        }
      });
    };

    this.modalService.confirm(message, action);
  }
}
