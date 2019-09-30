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
  selectedAlarmId: any;

  generalSettingFormGroup = new FormGroup({
    increaseVolume: new FormControl(false),
  });

  daysOfWeek = [
    { order: 0, key: 'Dom', label: 'D', value: 'Domingo' },
    { order: 1, key: 'Lun', label: 'L', value: 'Lunes' },
    { order: 2, key: 'Mar', label: 'M', value: 'Martes'  },
    { order: 3, key: 'Mie', label: 'M', value: 'Miercoles', },
    { order: 4, key: 'Jue', label: 'J', value: 'Jueves' },
    { order: 5, key: 'Vie', label: 'V', value: 'Viernes' },
    { order: 6, key: 'Sab', label: 'S', value: 'Sabado'}
  ];

  toneListOptions = [];
  alarmList = [];

  alarmName = new FormControl('');
  toneNameInput = new FormControl('');
  toneBodyInput = new FormControl('');


  showControlsToCreateTone = false;

  constructor(
    private alarmListService: AlarmListService,
    private atp: AmazingTimePickerService
  ) {

  }

  ngOnInit() {
    this.searchAllAlarms();
    this.searchAllSounds();
  }

  searchAllAlarms(){
    this.alarmListService.getAllAlamrs$()
    .pipe(
      map((alarmItems: any[]) => alarmItems.map(i => this.buildAlarmItem(i)) )
    )
    .subscribe(
      (result:any) => { 
        this.alarmList = result;
       },
      error => console.error(error),
      () => {}
    );
  }

  searchAllSounds(){
    this.alarmListService.getAllSounds$()
    .subscribe(
      (result: any[]) => {
        console.log(result);
        this.toneListOptions = result;
        
      },
      error => console.error(error),
      () => {}
    );
    
  }

  buildAlarmItem(alarm: any){
    return {
      _id: alarm._id,
      time: alarm.time || '00:00',
      format: alarm.format || '24H',
      active: ( alarm.active != null && typeof alarm.active === 'boolean' ) ? alarm.active : true,
      days: alarm.days || [],
      showDetails: false,
      showDaysToRepeat: (alarm.days || []).length > 0,
      tone: alarm.tone || null,
      // { name: 'La Vaca loca' }
    }
  }

  goToSettings() {
    console.log('HAY QUE IR AL COMPONENTE DE LA CONFIGURARCION');
    this.selectedScreem = 'settings';
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
      },
      (error) => {
        console.error(error)
      },
      () => console.log('Termina de actualizar los dias') 
    )
  }

  updateActiveStatus(alarmId, event: any) {
    console.log('on updateActiveStatus  => ', alarmId, event.checked);
    this.alarmListService.updateAlarm$({_id: alarmId, active: event.checked })
    .subscribe(
      (result) => {
        this.alarmList.find(e => e._id === alarmId).active = event.checked;
      },
      error => console.error(error),
      () => {}
    );



    //method to disactive an alarm


  }

  logEvent(e) {
    // item.showDaysToRepeat = $event.checked
    console.log(e);

  }

  openSelectionToneScreen(alarmId) {
    this.selectedScreem = 'soundSelection';
    this.selectedAlarmId = alarmId;
  }

  updateDaysToRepeat(alarmId, dayKey, event) {
    const toRemove = event.source.checked === false;
    // console.log({ alarmId, dayKey });
    // console.log();

    const alarmToUpdate = this.alarmList.find(item => item._id === alarmId);

    alarmToUpdate.days = toRemove
      ? alarmToUpdate.days.filter(day => day !== dayKey) // remove item
      : this.orderDays([...alarmToUpdate.days, dayKey]) //insert item


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
    );
    console.log(this.alarmList);
    

  }

  orderDays(days: String[]){
    return this.daysOfWeek.filter(day =>  days.includes(day.key))
      .sort((a, b) => (a.order - b.order))
      .map(day => day.key); 
  }

  assignNewAlarmTone() {
    const sound = {
      name: this.toneNameInput.value,
      content: this.toneBodyInput.value
    }
    this.alarmListService.createSound$(sound)
    .pipe(
      tap(result => console.log(result))

    ).subscribe((result) => {
      this.selectedScreem = 'main';
    })
    
  }

  setToneToAlarm(toneId) {

    console.log('on setToneToAlarm', toneId, this.selectedAlarmId);

    const toneSelected = this.toneListOptions.find(sound => sound._id === toneId);

    this.alarmListService.updateAlarm$({ 
      _id: this.selectedAlarmId,
      tone: toneSelected
    } )
    .subscribe(
      result => {
        console.log(result);
        this.alarmList.find(alarm => alarm._id === this.selectedAlarmId).tone = toneSelected;
      },
      error => console.log(error),
      () => {}
    )

    this.selectedScreem = 'main';

  }


  removeTone(toneId) {
    console.log('on RemoveTone ==> ', toneId);
    const toneToRemove = this.toneListOptions.find(t => t._id === toneId);

    this.alarmListService.deleteSound$(toneToRemove)
    .subscribe(
      result => {
        console.log(result);
        this.toneListOptions = this.toneListOptions.filter(t => t._id !== toneId);
      },
      error => console.log(error),
      () => {}
    )
    


  }

  addNewAlarmItem() {
    const alarmToCreate = {
      time: '00:00',      
      active: true,
      days: [], // todo     
      tone: {
        _id: 'default_0',
        name: 'Gallo Remix',
        audios: ['default_0']
      } 
    };
    
    this.alarmListService.createAlarm$(alarmToCreate)
    .pipe(
      map((result: any) => ({        
          _id: result._id,
          format: '24H',
          showDetails: false,
          showDaysToRepeat: false,
          ...alarmToCreate             
       })),

    )
    .subscribe(
      (result: any) => {
        console.log(result);
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
    this.alarmListService.deleteAlarm$(id)
    .pipe(


    ).subscribe(
      result => {
        this.alarmList = this.alarmList.filter(e => e._id !== id);
        console.log(result);
      },
      error => console.error(error),
      () => {}
    )
    

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

  showAlarmInfo(alarmId: string){
    this.alarmList.forEach(alarm => {
      alarm.showDetails = alarm._id === alarmId
        ? !alarm.showDetails
        : false;
    });
  }
}
