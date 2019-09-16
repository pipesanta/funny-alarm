import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators'

@Injectable()
export class AlarmListService {


  screenSizeChanged$ = new BehaviorSubject(undefined);
  commands$ = new BehaviorSubject(undefined);
  backEndUrl = 'http://192.168.1.15:7172';

  constructor(
    private httpClient: HttpClient
  ) {

   }


   test$(){
     return this.httpClient.get(`${this.backEndUrl}/alarm`)
   }

   createAlarm(alarm: any){
     return this.httpClient.post(`${this.backEndUrl}/alarm/createAlarm`,{
      alarm
     })
   }



}
