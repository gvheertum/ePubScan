import { Component } from '@angular/core';
import { ReadStates } from '../book'

@Component({
  selector: 'app-root',
  templateUrl: './app.root.html',
  styleUrls: ['./app.root.less']
})
export class AppComponent {
  readStates : ReadStates = new ReadStates();
  title = 'Book Catalog';
}
