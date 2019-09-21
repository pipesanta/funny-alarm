import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AlarmListComponent } from './alarm-list/alarm-list.component';
import { AlarmListService } from './alarm-list/alarm-list.service';
import { HttpClientModule } from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AmazingTimePickerModule } from 'amazing-time-picker';


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
    FormsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule
  ],
  providers: [AlarmListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
