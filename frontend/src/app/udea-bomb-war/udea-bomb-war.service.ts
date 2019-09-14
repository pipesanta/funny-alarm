import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../api/gateway.service';
import {
  loginToGame,
  playerUpdates,
  notifyPlayerUpdates
} from './gql/udeaBombWar.js';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UdeaBombWarService {

  static COMMAND_EXPLOIT_BOMB = 1;

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
