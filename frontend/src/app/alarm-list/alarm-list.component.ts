import { Component, OnInit } from '@angular/core';
import { AlarmListService } from './alarm-list.service';
import { map, filter, debounceTime, tap, takeUntil, mergeMap, timeout, switchMap } from 'rxjs/operators';
import { fromEvent, Subject, combineLatest, merge, interval, of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'alarm-list',
  templateUrl: './alarm-list.component.html',
  styleUrls: ['./alarm-list.component.scss']
})
export class AlarmListComponent implements OnInit {

  selectedScreem = 'main';
  selectedAlarm: any;

  generalSettingFormGroup = new FormGroup({
    increaseVolume: new FormControl(false),
  });

  daysOfWeek = [
    { key: 'Dom', label: 'D', value: 'Domingo', active: false },
    { key: 'Lun', label: 'L', value: 'Lunes', active: true },
    { key: 'Mar', label: 'M', value: 'Martes', active: false },
    { key: 'Mie', label: 'M', value: 'Miercoles', active: true },
    { key: 'Jue', label: 'J', value: 'Jueves', active: false },
    { key: 'Vie', label: 'V', value: 'Viernes', active: false },
    { key: 'Sab', label: 'S', value: 'Sabado', active: false }
  ];

  toneListOptions = [
    {
      _id: Date.now(),
      name: 'La vaca loca dormilona'
    },
    {
      _id: 234435643,
      name: 'El judio'
    }
  ];

  alarmList = [
    {
      _id: Date.now(),
      time: '12:34',
      format: '24H',
      active: true,
      days: ['Lun', 'Mar', 'Mier'],
      showDetails: false,
      showDaysToRepeat: false,
      tone: {
        name: 'La Vaca loca'
      }
    }
  ];

  alarmName = new FormControl('');
  toneNameInput = new FormControl('');
  toneBodyInput = new FormControl('');

  selectedTime = '18:33';

  showControlsToCreateTone = false;

  constructor(
    private alarmListService: AlarmListService
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
    this.selectedScreem = 'settings';
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



  openTimeSelection(alarmItem) {
    console.log('on openTimeSelection', alarmItem);
    // const amazingTimePicker = this.atp.open({
    //     time:  this.selectedTime,
    //     theme: 'dark',
    //     arrowStyle: {
    //         background: 'red',
    //         color: 'white'
    //     }
    // });
    // amazingTimePicker.afterClose().subscribe(time => {
    //     this.selectedTime = time;
    // });
  }

  updateActiveStatus(alarmId, event: any) {
    console.log('on updateActiveStatus  => ', alarmId, event.checked);
    this.alarmList.find(e => e._id === alarmId).active = event.checked;
    console.log(this.alarmList);
    


    //method to disactive an alarm


  }

  logEvent(e) {
    // item.showDaysToRepeat = $event.checked
    console.log(e);

  }

  openSelectionToneScreen(alarm) {
    this.selectedScreem = 'soundSelection';
    this.selectedAlarm = alarm;
  }

  updateDaysToRepeat(alarm, dayKey) {
    console.log({ alarm, dayKey })
  }

  assignNewAlarmTone() {

    console.log('assignNewAlarmTone ===> ', this.toneNameInput.value, this.toneNameInput.value);
    this.selectedScreem = 'main'
  }

  setToneToAlarm(tone) {
    console.log('on setToneToAlarm', tone);
    this.selectedScreem = 'main';

  }


  removeTone(toneId) {
    console.log('on RemoveTone ==> ', toneId);
    this.toneListOptions = this.toneListOptions.filter(t => t._id !== toneId);


  }

  addNewAlarmItem() {
    this.alarmList.push({
      _id: Date.now(),
      time: '04:15',
      format: '24H',
      active: true,
      days: ['Lun', 'Mie', 'Sab'],
      showDetails: false,
      showDaysToRepeat: false,
      tone: {
        name: 'La Vaca loca'
      }
    });
  }

  removeAlarmItem(id){
    console.log('on removeAlarm item =>', id);
    this.alarmList = this.alarmList.filter(e => e._id !== id);
    
  }
}
