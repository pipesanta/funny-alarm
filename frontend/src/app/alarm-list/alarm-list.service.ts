import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators'
import { environment } from '../../environments/environment';

@Injectable()
export class AlarmListService {

  serverHost = environment.server;

  screenSizeChanged$ = new BehaviorSubject(undefined);
  commands$ = new BehaviorSubject(undefined);
  backEndUrl = `http://${this.serverHost}`; //todo user ip estatica de la rasp

  constructor(
    private httpClient: HttpClient
  ) {

   }


   test$(){
     return this.httpClient.get(`${this.backEndUrl}/alarm`)
   }

   createAlarm$(alarm: any){
     return this.httpClient.post(`${this.backEndUrl}/alarm/createAlarm`, { ...alarm })
   }

   updateAlarm$(alarm: any){
    return this.httpClient.post(`${this.backEndUrl}/alarm/updateAlarm`, { ...alarm })
   }

   deleteAlarm$(id: string){
    return this.httpClient.post(`${this.backEndUrl}/alarm/deleteAlarm`, { _id: id })

   }

   getAllAlamrs$(){
    return this.httpClient.get(`${this.backEndUrl}/alarm/getAlarms`);
   }

   getAllSounds$(){
    return this.httpClient.get(`${this.backEndUrl}/sound/getSounds`);
   }

   createSound$(sound){
    return this.httpClient.post(`${this.backEndUrl}/sound/createSound`, { ...sound });
   }

   deleteSound$(tone){
    return this.httpClient.post(`${this.backEndUrl}/sound/deleteSound`, { ...tone });
   }

}
