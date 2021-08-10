import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { IBook } from 'src/book';
import { ReadStates } from "src/ReadStates";

@Component({
  selector: '[book-list-item]',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.less']
})
export class BookListItemComponent implements OnInit {
  @Input() book! : IBook;
  @Output() bookChange = new EventEmitter<IBook>();
  readStates : ReadStates = new ReadStates();
  constructor() { }

  ngOnInit(): void {
  }

  getBookDescriptionHtml() {
    return this.book.description?.replaceAll("\n", "<br/>");
  }
}
