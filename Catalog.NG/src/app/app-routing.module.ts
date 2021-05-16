import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookListComponent } from './book-list/book-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/books/all', pathMatch: 'full' },
  { path: 'book/:bookid', component: BookDetailComponent },
  { path: 'books/', redirectTo: '/books/all', pathMatch: 'full' },
  { path: 'books', redirectTo: '/books/all', pathMatch: 'full' },
  { path: 'books/:status', component: BookListComponent }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
