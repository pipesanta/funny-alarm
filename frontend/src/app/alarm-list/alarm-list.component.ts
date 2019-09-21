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

  createNewAlarm() {
    // create the alarm object
    const alarmToCreate = {
      name: this.alarmName.value,
      time: '4:20', //this.alarmTime.value,
      format: 'am', //this.alarmFormat.value,
      days: ['Thuesday', 'Monday', 'Saturday'], //this.alarmDays.value,
      tone: 'dinner.mp3', //this.alarmTone.value,
      status: false //this.alarmStatus.value,
    }
    console.log({ ...alarmToCreate });


    this.alarmListService.createAlarm$(alarmToCreate)
      .subscribe(
        ok => console.log(ok),
        error => console.log(error),
        () => console.log('terminado')
      );

  }

  updateAlarms() {
    const alarmToUpdate = {
      //EJEMPLO DE ALARMA
      _id: 'ajksdhaskjdhasdjashdka', //this.alarmId.value,
      name: 'Almuerzo', //this.alarmName.value,
      time: '4:20', //this.alarmTime.value,
      format: 'am', //this.alarmFormat.value,
      days: ['Thuesday', 'Monday', 'Saturday'], //this.alarmDays.value,
      tone: 'dinner.mp3', //this.alarmTone.value,
      status: false //this.alarmStatus.value,
    }
    console.log({ ...alarmToUpdate });


    this.alarmListService.updateAlarm$(alarmToUpdate)
      .subscribe(
        ok => console.log(ok),
        error => console.log(error),
        () => console.log('terminado')
      );
  }

  deleteAlarms(id: string) {
    console.log(id);


    this.alarmListService.deleteAlarm$(id)
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
