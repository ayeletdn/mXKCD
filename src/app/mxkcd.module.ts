import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { MxkcdComponent } from './mxkcd.component';
import { ComicComponent } from './comic/comic.component';

@NgModule({
  declarations: [
    MxkcdComponent,
    ComicComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [MxkcdComponent]
})
export class ComicModule { }
