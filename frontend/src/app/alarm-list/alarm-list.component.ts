import { Component, OnInit } from '@angular/core';
import { AlarmListService } from './alarm-list.service';
import { map, filter, debounceTime, tap, takeUntil, mergeMap, timeout, switchMap } from 'rxjs/operators';
import { fromEvent, Subject, combineLatest, merge, interval, of } from 'rxjs';

@Component({
  selector: 'alarm-list',
  templateUrl: './alarm-list.component.html',
  styleUrls: ['./alarm-list.component.css']
})
export class AlarmListComponent implements OnInit {

  alarmList = ['Santa', 'Anderson', 'Jarris', 'cristian']

  constructor(private alarmListService: AlarmListService) {

  }

  ngOnInit() {



  }

}
