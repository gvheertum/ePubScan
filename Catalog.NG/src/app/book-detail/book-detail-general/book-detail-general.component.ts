import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'src/book';

@Component({
  selector: 'app-book-detail-general',
  templateUrl: './book-detail-general.component.html',
  styleUrls: ['./book-detail-general.component.less']
})
export class BookDetailGeneralComponent implements OnInit {
  @Input() book!: IBook;

  constructor() { }

  ngOnInit(): void {
  }

}
