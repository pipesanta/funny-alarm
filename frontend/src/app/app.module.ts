import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AlarmListComponent } from './alarm-list/alarm-list.component';
import { AlarmListService } from './alarm-list/alarm-list.service';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    AlarmListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [AlarmListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
