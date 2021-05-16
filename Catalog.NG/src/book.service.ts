import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IBook, IBookReadBadgeUpdateModel } from './book';
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
      tap(_ => this.log('fetched book')),
      catchError(this.handleError<boolean>('updateBookReadBadge', null))
      );
   }
   
  //////// Save methods //////////

  /** POST: add a new hero to the server */
//   addHero(hero: Hero): Observable<Hero> {
//     return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
//       tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
//       catchError(this.handleError<Hero>('addHero'))
//     );
//   }

  /** DELETE: delete the hero from the server */
//   deleteHero(id: number): Observable<Hero> {
//     const url = `${this.heroesUrl}/${id}`;

//     return this.http.delete<Hero>(url, this.httpOptions).pipe(
//       tap(_ => this.log(`deleted hero id=${id}`)),
//       catchError(this.handleError<Hero>('deleteHero'))
//     );
//   }

  /** PUT: update the hero on the server */
//   updateHero(hero: Hero): Observable<any> {
//     return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
//       tap(_ => this.log(`updated hero id=${hero.id}`)),
//       catchError(this.handleError<any>('updateHero'))
//     );
//   }

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
    console.log(`Book: ${message}`);
  }
}