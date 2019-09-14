import { Injectable } from '@angular/core';
import { GatewayService } from '../api/gateway.service';
import {
  loginToGame,
  playerUpdates,
  notifyPlayerUpdates
} from './gql/alarm-list.js';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AlarmListService {


  screenSizeChanged$ = new BehaviorSubject(undefined);
  commands$ = new BehaviorSubject(undefined);

  constructor(
     private gateway: GatewayService
  ) {

   }


  loginToGame$(){
    return this.gateway.apollo
    .mutate<any>({
      mutation: loginToGame,
      errorPolicy: 'all'
    });
  }

  listenNewPlayersArrival$(){
    return this.gateway.apollo
    .subscribe({
      query: playerUpdates
    });
  }

  notifyUpdates(id, x, y){
    return this.gateway.apollo
    .mutate<any>({
      mutation: notifyPlayerUpdates,
      variables: {
        id, x, y
      },
      errorPolicy: 'all'
    });
  }

  publishSizeChangedEvent(width, height){
    this.screenSizeChanged$.next({width, height})
  }

  publishCommand(command){
    this.commands$.next(command);
  }


}
