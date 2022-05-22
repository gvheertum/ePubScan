import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.root';
import { HttpClientModule } from '@angular/common/http';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookListItemComponent } from './book-list/book-list-item/book-list-item.component';
import { BookDetailGeneralComponent } from './book-detail/book-detail-general/book-detail-general.component';
import { BookDetailReadstatusComponent } from './book-detail/book-detail-readstatus/book-detail-readstatus.component';
import { BookDetailAvailabilitystatusComponent } from './book-detail/book-detail-availabilitystatus/book-detail-availabilitystatus.component';
import { MasterContentComponent } from './master-content/master-content.component';
import { BookReadstatusUpdaterComponent } from './book-readstatus-updater/book-readstatus-updater.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from './toast/toast.module';
import { ModalComponent } from './modal/modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatCommonModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    BookReadstatusUpdaterComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCommonModule, /* WARNING! The module must be imported! Not the component!! */
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
