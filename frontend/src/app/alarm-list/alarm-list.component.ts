import { Component, OnInit } from '@angular/core';
import { AlarmListService } from './alarm-list.service';
import { map, filter, debounceTime, tap, takeUntil, mergeMap, timeout, switchMap } from 'rxjs/operators';
import { fromEvent, Subject, combineLatest, merge, interval, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'alarm-list',
  templateUrl: './alarm-list.component.html',
  styleUrls: ['./alarm-list.component.scss']
})
export class AlarmListComponent implements OnInit {

  alarmList = [
    {
      time: '12:34',
      format: '24H',
      active: true
    }
  ];

  alarmName = new FormControl('');
  selectedTime = '18:33';

  constructor(
    private alarmListService: AlarmListService,
    private atp: AmazingTimePickerService
    ) {

  }

  ngOnInit() {

    this.alarmListService.test$()
      .subscribe(
        ok => console.log(ok),
        error => console.log(error)
      );



    


  }

  goToSettings() {
    console.log('HAY QUE IR AL COMPONENTE DE LA CONFIGURARCION');
  }

  createNewAlarm(){
    // create the alarm object
    const alarmToCreate = {
      name: this.alarmName.value,

    }
    console.log({...alarmToCreate});
    

    this.alarmListService.createAlarm$(alarmToCreate)
      .subscribe(
        ok => console.log(ok),
        error => console.log(error),
        () => console.log('terminado')        
      );

  }



  open() {
    const amazingTimePicker = this.atp.open({
        time:  this.selectedTime,
        theme: 'dark',
        arrowStyle: {
            background: 'red',
            color: 'white'
        }
    });
    amazingTimePicker.afterClose().subscribe(time => {
        this.selectedTime = time;
    });
}

}
