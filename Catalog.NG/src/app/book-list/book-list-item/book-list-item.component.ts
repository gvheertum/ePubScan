import { Component, Input, OnInit } from '@angular/core';
import { IBook, ReadStates, ReadStateElement } from 'src/book';

@Component({
  selector: '[book-list-item]',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.less']
})
export class BookListItemComponent implements OnInit {
  @Input() book! : IBook;
  readStates : ReadStates = new ReadStates();
  constructor() { }

  ngOnInit(): void {
  }

  updateStatus(status: ReadStateElement) {
    alert(`Change status to: ${status.display} code: ${status.code}`);
  }
}
