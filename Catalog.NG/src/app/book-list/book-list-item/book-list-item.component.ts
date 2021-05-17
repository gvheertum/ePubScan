import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'src/book';
import { ReadStates } from "src/ReadStates";

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
}
