import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HotToastModule } from '@ngneat/hot-toast';

import { AppComponent } from './app.component';
import { LoadingSkeletonComponent } from './loading-skeleton/loading-skeleton.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserCardComponent } from './user-card/user-card.component';



@NgModule({
  declarations: [
    AppComponent,
   LoadingSkeletonComponent,
   UserSearchComponent,
   UserCardComponent,
  ],
  imports: [
    HotToastModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
