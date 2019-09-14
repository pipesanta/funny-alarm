import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { UdeaBombWarService } from './udea-bomb-war.service';
import { map, filter, debounceTime, tap, takeUntil, mergeMap, timeout, switchMap } from 'rxjs/operators';
import { fromEvent, Subject, combineLatest, merge, interval, of } from 'rxjs';
import { MAP_JSON_DATA } from './resources/udeaJsonMap';
import { Map, ASSETS_PATH } from './entities/Map';
import { Player } from './entities/Player';
import { Point } from './entities/Point';

@Component({
  selector: 'app-udea-bomb-war',
  templateUrl: './udea-bomb-war.component.html',
  styleUrls: ['./udea-bomb-war.component.css']
})
export class UdeaBombWarComponent implements OnInit {


  debuggin = false;
  dimensions;

  private ngUnsubscribe = new Subject();
  tilesSize = 100;
  scale = 1;

  // AUDIO RESOURCES
  audio = {
    music: null
  }

  // MAP
  map: Map;
  myPlayer: Player;

  // PLAYER ARRAY
  players = [];
  bombsOnMap = [];

  pressedKeys = [];

  lastPositionReported = {x:0, y:0}


  constructor(private udeaBombWarService: UdeaBombWarService) {

  }

  ngOnInit() {

    this.listenResizeEvent();
    this.listenKeyBoard();




    this.playAudio(ASSETS_PATH + 'audio/soundtrack.mp3');

    this.initMap();
    console.log(this.map);

    this.initMyUser();

    this.listenPlayersArrival();




  }

  getRandonNumber() {
    return Math.random() * 10000;
  }

  /**
* listen the window size changes
*/
  listenResizeEvent() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(50),
        map((size: any) => {

          const tileSizeModified = (this.tilesSize * this.scale);
          const height = size.currentTarget.innerHeight || window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          const width = size.currentTarget.innerWidth || window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

          return {
            height, width,
            horizontalTiles: Math.ceil((screen.width - tileSizeModified) / tileSizeModified),
            verticalTiles: Math.ceil((screen.height - tileSizeModified) / tileSizeModified),
          }

        }),
        takeUntil(this.ngUnsubscribe)
      ).subscribe(size => {
        this.dimensions = size;
      });
  }

  listenKeyBoard() {
    merge(
      fromEvent(window, 'keydown').pipe(map((e: any) => ({ type: 'keydown', key: e.code }))),
      fromEvent(window, 'keyup').pipe(map((e: any) => ({ type: 'keyup', key: e.code })))
    )
      .pipe(
        filter((e: any) => e && e.type),
        tap((event: any) => {
          const key = this.pressedKeys.find(i => i === event.key);
          switch (event.type) {
            case 'keydown':
              if (!key) { this.pressedKeys.push(event.key) }
              break;
            case 'keyup':
              this.pressedKeys = this.pressedKeys.filter(i => i !== event.key);
              break;

            default:
              break;
          }

        }),
        takeUntil(this.ngUnsubscribe)
      ).subscribe();
  }

  playAudio(songPath) {
    if (this.audio.music != null) {
      this.audio.music.pause();
      this.audio.music.src = "";
    }
    this.audio.music = new Audio(songPath);
    console.log(this.audio);
    // this.audio.music.play();
  }

  initMap() {
    this.map = new Map(MAP_JSON_DATA, 0);
  }

  initMyUser() {
    this.udeaBombWarService.loginToGame$()
      .pipe(
        map(response => (response.data || {}).loginToGame),
        filter(response => response),
        tap(response => {
          this.myPlayer = new Player(
            new Point(Math.floor(Math.random() * 150), Math.floor(Math.random() * 150)),
            0, response.character, response.user_id
          );
          this.publishPositions();
        }),
        mergeMap(() => interval(20)),
        tap(() => {
          this.myPlayer.update(Date.now(), this.map, this.pressedKeys)
        }),     
        takeUntil(this.ngUnsubscribe)
      ).subscribe();
      }

  publishPositions(){
    interval(50)
      .pipe(
        filter(() => {
          return  this.lastPositionReported.x !== this.myPlayer.pxPositionOnMap.x &&
          this.lastPositionReported.y !== this.myPlayer.pxPositionOnMap.y
        }),
        switchMap(() => {

        this.lastPositionReported = {
          x: this.myPlayer.pxPositionOnMap.x,
          y: this.myPlayer.pxPositionOnMap.y
        }
         return this.udeaBombWarService.notifyUpdates(
           this.myPlayer.htmlDivId, 
           this.myPlayer.pxPositionOnMap.x,
           this.myPlayer.pxPositionOnMap.y)
        })
      ).subscribe()
    
  }

  listenPlayersArrival() {
    this.udeaBombWarService.listenNewPlayersArrival$()
      .pipe(
        map(r => (r.data || {}).playerUpdates ),
        takeUntil(this.ngUnsubscribe)
      ).subscribe((response: any) => {
        // console.log(response);
        
        const player = this.players.find(p => p.htmlDivId === response.user_id);
        if (!player) {
          const newPlayer = new Player(
            new Point(Math.floor(Math.random() * 150), Math.floor(Math.random() * 150)),
            0, response.character, response.user_id
          );
          this.players.push(newPlayer);
        } else {

          const xRandon = response.xPosition;
          const yRandon = response.yPosition;


          document.getElementById(response.user_id).style.transform = 'translate3d(' + '- ' + xRandon + 'px, ' + '-' + yRandon + 'px, 0' + ')';

          document.getElementById(response.user_id).style.left = xRandon + "px";
          document.getElementById(response.user_id).style.top = yRandon + "px";
        }
      })
  }



  putBombOnMap(id, timestampToExploit) {
    const bomb = {
      id,
      exploit: () => {
        const timeToexploit = timestampToExploit - Date.now();
        if (timeToexploit > 0) {
          setTimeout(() => {
            console.log('EXPLOTANDO......', id);

            this.udeaBombWarService.publishCommand({
              code: UdeaBombWarService.COMMAND_EXPLOIT_BOMB,
              args: [id]
            });

          }, timeToexploit);
        }
      }
    }
    this.bombsOnMap.push(bomb);
    bomb.exploit();

  }








}
