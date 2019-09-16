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

  alarmList = [
    {
      timestamp: 0,
      time: '8:30',
      format: 'am',
      active: false
    },
    {
      timestamp: 0,
      time: '4:30',
      format: 'am',
      active: true
    },
    {
      timestamp: 0,
      time: '4:35',
      format: 'am',
      active: false
    },
    {
      timestamp: 0,
      time: '4:40',
      format: 'am',
      active: true
    },
    {
      timestamp: 0,
      time: '4:50',
      format: 'am',
      active: false
    },
  ];

  constructor(private alarmListService: AlarmListService) {

  }

  ngOnInit() {

    this.alarmListService.test$()
      .subscribe(
        ok => console.log(ok),
        error => console.log(error)
      );

    this.alarmListService.createAlarm({
      time: '12:50',
      format: 'am',
      name: 'a almorzr'

    })
      .subscribe(
        ok => console.log(ok),
        error => console.log(error)
      );



  }

  goToSettings() {
    console.log('HAY QUE IR AL COMPONENTE DE LA CONFIGURARCION');
  }

}
