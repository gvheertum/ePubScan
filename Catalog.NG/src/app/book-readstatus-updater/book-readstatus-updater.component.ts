import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() bookChange = new EventEmitter<IBook>();

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
    
    var bookDisplay = `${book.Author} - ${book.Title}`;
    var message = `Do you want to change the status for book ${book.BookID}: ${bookDisplay} ${status.display}?\r\nOld state was: ${book.ReadStatus}`;
    var action = () => {
      book.ReadStatus = status.display;
      
      this.bookService.updateBookReadBadge(book.BookID, status.display).subscribe((r) => {
        if(r) { 
          this.toastService.info(`${bookDisplay} marked with read status: ${status.display}`);
        } else { 
          this.toastService.warn("Could not update the book details!"); 
        }
        
        //Call an update of the book
        console.debug("Emit change!");
        this.bookChange.emit(book);
      });
    };

    this.modalService.confirm(message, action, () => {});
  }
}
