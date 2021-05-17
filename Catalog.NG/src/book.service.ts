import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IBook, IBookAvailabilityStatusUpdateModel, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel } from './book';
import { Settings } from './settings';


@Injectable({ providedIn: 'root' })
export class BookService {

  private booksUrl : string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    settings: Settings,
   ) { 
     this.booksUrl = settings.getSecrets().getBooksUrl();
   }

   getBooks() : Observable<IBook[]> {
    return this.http.get<IBook[]>(this.booksUrl + "Books/All")
        .pipe(
        tap(_ => this.log('fetched books')),
        catchError(this.handleError<IBook[]>('getBooks', []))
        );
   }

   getBook(bookId: number) : Observable<IBook> {
    return this.http.get<IBook>(this.booksUrl + `Book/${bookId}/Detail`)
        .pipe(
        tap(_ => this.log('fetched book')),
        catchError(this.handleError<IBook>('getBook', null))
        );
   }
  
   updateBookReadBadge(bookId: number, readBadge: string) : Observable<boolean> {
    
    var postData : IBookReadBadgeUpdateModel = { bookID: bookId, readStatus: readBadge };

    return this.http.post<boolean>(this.booksUrl + `Book/${bookId}/UpdateReadBadge`, postData)
      .pipe(
      tap(_ => this.log('Updated read badge')),
      catchError(this.handleError<boolean>('updateBookReadBadge', null))
      );
   }

   updateBookReadStatus(bookReadStatusModel : IBookReadStatusUpdateModel) : Observable<boolean> {
    return this.http.post<boolean>(this.booksUrl + `Book/${bookReadStatusModel.bookID}/UpdateReadStatus`, bookReadStatusModel)
      .pipe(
      tap(_ => this.log('Updated bookReadStatus')),
      catchError(this.handleError<boolean>('updateBookReadStatus', null))
      );
   }

   updateBookDetails(bookDetailModel: IBookDetailUpdateModel) : Observable<boolean> {
    return this.http.post<boolean>(this.booksUrl + `Book/${bookDetailModel.bookID}/UpdateBookData`, bookDetailModel)
      .pipe(
      tap(_ => this.log('Updated bookDetails')),
      catchError(this.handleError<boolean>('updateBookDetails', null))
      );
   }

   updateBookAvailabilityStatus(bookAvailabilityModel: IBookAvailabilityStatusUpdateModel) : Observable<boolean> {
    return this.http.post<boolean>(this.booksUrl + `Book/${bookAvailabilityModel.bookID}/UpdateAvailabilityStatus`, bookAvailabilityModel)
      .pipe(
      tap(_ => this.log('Updated bookDetails')),
      catchError(this.handleError<boolean>('updateBookDetails', null))
      );
   }
   
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T | null) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.debug(`Book: ${message}`);
  }
}