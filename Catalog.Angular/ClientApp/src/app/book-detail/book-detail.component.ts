import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent {
  public book : IBook;
  
//TODO: Work with service instead of the url and try to get stuff from the route
  //constructor() {
    constructor(private route : ActivatedRoute, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
      var id = route.snapshot.paramMap.get("id");

      http.get<IBook>(baseUrl + 'api/Book/' + id + '/Detail').subscribe(result => {
      this.book = result;
    }, error => console.error(error));

  }
}


