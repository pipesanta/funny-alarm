import { Component, OnInit } from '@angular/core';
import { AlarmListService } from './alarm-list.service';
import { map, filter, debounceTime, tap, takeUntil, mergeMap, timeout, switchMap } from 'rxjs/operators';
import { fromEvent, Subject, combineLatest, merge, interval, of, defer, forkJoin } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';

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
    { key: 'Dom', label: 'D', value: 'Domingo' },
    { key: 'Lun', label: 'L', value: 'Lunes' },
    { key: 'Mar', label: 'M', value: 'Martes'  },
    { key: 'Mie', label: 'M', value: 'Miercoles', },
    { key: 'Jue', label: 'J', value: 'Jueves' },
    { key: 'Vie', label: 'V', value: 'Viernes' },
    { key: 'Sab', label: 'S', value: 'Sabado'}
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
    // {
    //   _id: Date.now(),
    //   time: '12:34',
    //   format: '24H',
    //   active: true,
    //   days: ['Lun', 'Mar', 'Mier'],
    //   showDetails: false,
    //   showDaysToRepeat: false,
    //   tone: {
    //     name: 'La Vaca loca'
    //   }
    // }
  ];

  alarmName = new FormControl('');
  toneNameInput = new FormControl('');
  toneBodyInput = new FormControl('');

  selectedTime = '18:33';

  showControlsToCreateTone = false;

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

    this.atp.open({
      time: alarmItem.time,
      changeToMinutes: true,
      locale: 'es',
      animation: 'fade',
      theme: 'material-blue'
    }).afterClose().subscribe(
      (time) => {
        const update = { _id: alarmItem._id, time: time  };
        this.alarmListService.updateAlarm$(update)
          .subscribe(
            (result) => {
              alarmItem.time = time;
              console.log('RESULTADO',result);
            }
          )
        // alarmItem.time = update.time;
        // console.log( 'DESPUS DE CERRAR ==> ', result);
      },
      (error) => {
        console.error(error)
      },
      () => console.log('Termina de actualizar los dias') 
    )
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

  updateDaysToRepeat(alarmId, dayKey, event) {
    const toRemove = event.source.checked === false;
    // console.log({ alarmId, dayKey });
    // console.log();

    const alarmToUpdate = this.alarmList.find(item => item._id === alarmId);

    if(toRemove){
      alarmToUpdate.days = alarmToUpdate.days.filter(day => day !== dayKey);
    }else{
      alarmToUpdate.days.push(dayKey);
    }

    this.alarmListService.updateAlarm$({
      _id: alarmId,
      days: alarmToUpdate.days
    })
    .subscribe(
      (result: any) => {
        console.log(result);
      },
      (error) => {
        console.error(error)
      },
      () => console.log('Termina de actualizar los dias') 
    )

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
    // this.alarmList.push(
      
    // );
    this.alarmListService.createAlarm$({})
    .pipe(
      map((result: any) => ({        
          _id: result._id,
          time: '00:00',
          format: '24H',
          active: true,
          days: [], // todo
          showDetails: false,
          showDaysToRepeat: false,
          tone: null
          /*{
            _id: '3423423',
            name: 'La Vaca loca'
          }  */       
       })),

    )
    .subscribe(
      (result: any) => {
        this.alarmList.push(result);
      },
      (error) => {
        console.error(error)
      },
      () => console.log('Termina de crear la alarma') 
    )
  }

  removeAlarmItem(id) {
    console.log('on removeAlarm item =>', id);
    this.alarmList = this.alarmList.filter(e => e._id !== id);

  }

  onRepeatChanged(alarmItemId, event: any){
    const alarmToUpdate = this.alarmList.find(alarm => alarm._id === alarmItemId);
    alarmToUpdate.showDaysToRepeat = event.checked;
    alarmToUpdate.days = [];
    const update = { _id: alarmItemId, days: [] };
    this.alarmListService.updateAlarm$(update)
    .subscribe(
      result => {
        console.log(result);
      },
      error => console.error(error),
      () => console.log('TERMINA DE ELIMIAR LA REPETICIONES DE LOS DIAS')
    )
    
  }
}
