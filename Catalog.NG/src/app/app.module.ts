import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.root';
import { HttpClientModule } from '@angular/common/http';
import { Secrets } from '../secrets'
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookListItemComponent } from './book-list/book-list-item/book-list-item.component';
import { BookDetailGeneralComponent } from './book-detail/book-detail-general/book-detail-general.component';
import { BookDetailReadstatusComponent } from './book-detail/book-detail-readstatus/book-detail-readstatus.component';
import { BookDetailAvailabilitystatusComponent } from './book-detail/book-detail-availabilitystatus/book-detail-availabilitystatus.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MasterContentComponent } from './master-content/master-content.component';
import { BookReadstatusUpdaterComponent } from './book-readstatus-updater/book-readstatus-updater.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BookDetailComponent,
    BookListComponent,
    BookListItemComponent,
    BookDetailGeneralComponent,
    BookDetailReadstatusComponent,
    BookDetailAvailabilitystatusComponent,
    MasterContentComponent,
    BookReadstatusUpdaterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
