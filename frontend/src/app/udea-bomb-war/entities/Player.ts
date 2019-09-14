import { ASSETS_PATH } from "./Map";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { any } from "async";

export class Player {
  checkCollisions: (mapa: any) => void;
  moveOnMap: (pressedKeys: any[], playerId: string) => void;
  moveOnLevel: () => void;
  lead: () => void;
  animate: () => void;
  update: (registroTemporal: any, mapa: any, pressedKeys: string[]) => void;
  leftCollision: boolean;
  applyStyles: (playerId: string) => void;
  gameState: any;
  width: number;
  height: number;
  spriteSheetPath: string;
  character: number;
  startXSprite: number;
  startYSprite: number;
  movementSpeed: number;
  xSpeed: number;
  ySpeed: number;
  // movingToUp: boolean;
  fallSpeed: number;
  terminalSpeed: number;
  moving: boolean;
  framesAnimation: number;
  centeredPosition: Point;
  generalRectangle: Rectangle;
  topLimit: Rectangle;
  bottonLimmit: Rectangle;
  leftLimit: any;
  rightLimit: Rectangle;
  topCollision: boolean;
  bottonCollision: boolean;
  rightCollision: boolean;
  pxPositionOnMap: Point;

  htmlDivId;

  constructor(initialPositionPx: Point, gameState, character: number, playerId: string) {
    this.gameState = gameState;
    this.htmlDivId = playerId;
    this.width = 16;
    this.height = 16;

    this.spriteSheetPath = ASSETS_PATH + "images/characters.png";
    this.character = character || 4;; //elegir personaje

    this.startXSprite = 0;
    this.startYSprite = this.height * this.character;

    this.movementSpeed = 1;

    this.xSpeed = 0;
    this.ySpeed = 0;

    // this.movingToUp = false;
    // this.saltoBloqueado = false;
    // this.saltoYInicial = 0;
    // this.framesAereosMaximos = 12;
    // this.framesAereos = this.framesAereosMaximos;

    this.terminalSpeed = 10;
    this.fallSpeed = 0;

    //modo escalera

    this.moving = false;
    this.framesAnimation = 0;

    //eliminar decimales y centrar al jugador
    var xCenter = 500 // Math.trunc(dimensiones.ancho / 2 - this.ancho / 2);
    var yCenter = 500 // Math.trunc(dimensiones.alto / 2 - this.alto / 2);
    this.centeredPosition = new Point(xCenter, yCenter);
    this.generalRectangle = new Rectangle(xCenter, yCenter, this.width, this.height, 'player');

    this.topLimit = new Rectangle(xCenter + this.width / 3, yCenter, this.width / 3, 1);
    this.bottonLimmit = new Rectangle(xCenter + this.width / 3, yCenter + this.height - 1, this.width / 3, 1);
    this.leftLimit = new Rectangle(xCenter, yCenter + this.height / 3, 1, this.height / 3);
    this.rightLimit = new Rectangle(xCenter + this.width - 1, yCenter + this.height / 3, 1, this.height / 3);

    this.topCollision = false;
    this.bottonCollision = false;
    this.leftCollision = false;
    this.rightCollision = false;

    //convertir positivos en negativos y viceversa
    initialPositionPx.x *= -1;
    initialPositionPx.y *= -1;

    this.pxPositionOnMap = new Point(this.centeredPosition.x + initialPositionPx.x,
      this.centeredPosition.y + initialPositionPx.y);

    this.applyStyles(playerId);


  }
}

Player.prototype.applyStyles = function (playerId) {

  const playerDiv = document.createElement('div');
  playerDiv.setAttribute("id", playerId);
  document.getElementById('juego').appendChild(playerDiv);


  var idHTML = playerId;
  //document.getElementById(idHTML).style.backgroundColor = "white";
  document.getElementById(idHTML).style.position = "absolute";
  document.getElementById(idHTML).style.left = this.centeredPosition.x + "px";
  document.getElementById(idHTML).style.top = this.centeredPosition.y + "px";
  document.getElementById(idHTML).style.width = this.width + "px";
  document.getElementById(idHTML).style.height = this.height + "px";
  document.getElementById(idHTML).style.zIndex = "10";
  document.getElementById(idHTML).style.background = `url(${this.spriteSheetPath})`;
  document.getElementById(idHTML).style.backgroundPosition = "-" + this.startXSprite + "px -" + this.startYSprite + "px";
  document.getElementById(idHTML).style.backgroundClip = "border-box";
  document.getElementById(idHTML).style.outline = "1px solid transparent";
}

Player.prototype.checkCollisions = function (map) {
  this.topCollision = false;
  this.bottonCollision = false;
  this.leftCollision = false;
  this.rightCollision = false;

  if (!this.topLimit.cross(map.mapLimit)) {
    console.log('SE DIO EN EL LIMITE SUPERIOR');
    this.topCollision = true;
  }
  if (!this.bottonLimmit.cross(map.mapLimit)) {
    console.log('SE DIO EN EL LIMITE INFERIOR');
    this.bottonCollision = true;
  }
  if (!this.leftLimit.cross(map.mapLimit)) {
    console.log('SE DIO EN EL LIMITE IZQUIERDO');
    this.leftCollision = true;
  }
  if (!this.rightLimit.cross(map.mapLimit)) {
    console.log('SE DIO EN EL LIMITE DERECHO');
    this.rightCollision = true;
  }

  for (let i = 0; i < map.rectanglesCollisions.length; i++) {

    var temporalCollisionRef = new Rectangle(
      map.rectanglesCollisions[i].x + map.position.x,
      map.rectanglesCollisions[i].y + map.position.y,
      map.rectanglesCollisions[i].width,
      map.rectanglesCollisions[i].height
    );

    if (this.topLimit.cross(temporalCollisionRef)) {
      console.log('CONTACTO CON CAPA DE COLISIONES EN PARTE SUPERIOR');

      this.topCollision = true;
    }
    if (this.bottonLimmit.cross(temporalCollisionRef)) {
      console.log('CONTACTO CON CAPA DE COLISIONES EN PARTE INFERIOR');
      this.bottonCollision = true;
    }
    if (this.leftLimit.cross(temporalCollisionRef)) {
      console.log('CONTACTO CON CAPA DE COLISIONES EN PARTE IZQUIERDO');
      this.leftCollision = true;
    }
    if (this.rightLimit.cross(temporalCollisionRef)) {
      console.log('CONTACTO CON CAPA DE COLISIONES EN PARTE DERECHO');
      this.rightCollision = true;
    }
  }
}

Player.prototype.moveOnMap = function (pressedKeys: any[]) {

  this.xSpeed = 0;
  this.ySpeed = 0;

  if (!this.topCollision && pressedKeys.includes('KeyW')) {
    this.ySpeed += this.movementSpeed;
  }
  if (!this.bottonCollision && pressedKeys.includes('KeyS')) {
    this.ySpeed -= this.movementSpeed;
  }
  if (!this.leftCollision && pressedKeys.includes('KeyA')) {
    this.xSpeed += this.movementSpeed;
  }
  if (!this.rightCollision && pressedKeys.includes('KeyD')) {
    this.xSpeed -= this.movementSpeed;
  }

  this.pxPositionOnMap.x -= this.xSpeed;
  this.pxPositionOnMap.y -= this.ySpeed;


  document.getElementById(this.htmlDivId).style.transform = 'translate3d(' + '- ' + this.pxPositionOnMap.x + 'px, ' + '-' + this.pxPositionOnMap.y + 'px, 0' + ')';

  document.getElementById(this.htmlDivId).style.left = this.pxPositionOnMap.x + "px";
  document.getElementById(this.htmlDivId).style.top = this.pxPositionOnMap.y + "px";





}

// Player.prototype.moveOnLevel = function () {
//   this.velocidadX = 0;
//   this.velocidadY = 0;

//   if (this.saltoBloqueado && this.colisionAbajo && !teclado.teclaPulsada(controlesTeclado.saltar)) {
//     this.saltoBloqueado = false;
//     this.velocidadCaida = 0;
//     console.log();
//   }

//   if (!this.saltoBloqueado && teclado.teclaPulsada(controlesTeclado.saltar)) {
//     this.subiendo = true;
//     this.saltoBloqueado = true;
//   }

//   if (!this.colisionArriba && this.subiendo) {
//     this.framesAereos--;
//     this.velocidadY = 1 * this.velocidadMovimiento + this.framesAereos;

//     if (this.framesAereos <= 0) {
//       this.subiendo = false;
//       this.framesAereos = this.framesAereosMaximos;
//     }
//   }

//   if (!this.colisionAbajo && !this.subiendo) {
//     this.velocidadY = Math.round(-this.velocidadCaida);
//     console.log(this.velocidadY);
//     if (this.velocidadCaida < this.velocidadTerminal) {
//       this.velocidadCaida += 0.3;
//     }
//   }

//   if (!this.colisionIzquierda && teclado.teclaPulsada(controlesTeclado.izquierda)) {
//     this.velocidadX = 1 * this.velocidadMovimiento;
//   }

//   if (!this.colisionDerecha && teclado.teclaPulsada(controlesTeclado.derecha)) {
//     this.velocidadX = -1 * this.velocidadMovimiento;
//   }

//   this.posicionEnMapaEnPixeles.x += this.velocidadX;
//   this.posicionEnMapaEnPixeles.y += this.velocidadY;
// }

Player.prototype.lead = function () {
  if (this.xSpeed < 0) { //izquierda
    this.startXSprite = this.width * 3;
  }
  if (this.xSpeed > 0) { //derecha
    this.startXSprite = this.width * 3;
  }
  if (this.ySpeed < 0) { //abajo
    this.startXSprite = 0;
  }
  if (this.ySpeed > 0) { //arriba
    this.startXSprite = this.width * 6;

  }

  if (this.xSpeed > 0) { //derecha
    document.getElementById(this.htmlDivId).style.transform = "scaleX(-1)";
  }
  if (this.xSpeed < 0 || this.ySpeed < 0 || this.ySpeed > 0) { //izquierda
    document.getElementById(this.htmlDivId).style.transform = "scaleX(1)";
  }

  document.getElementById(this.htmlDivId).style.backgroundPosition = "-" + this.startXSprite + "px -" + this.startYSprite + "px";

}

Player.prototype.animate = function () {
  if (this.xSpeed == 0 && this.ySpeed == 0) {
    this.framesAnimation = 0;
    return;
  }

  this.framesAnimation++;

  let step1 = 10;
  let step2 = 20;
  let tempStartXSpride = this.startXSprite;

  if (this.framesAnimation > 0 && this.framesAnimation < step1) {
    tempStartXSpride += this.width;
  }
  if (this.framesAnimation >= step1 && this.framesAnimation < step2) {
    tempStartXSpride += this.width * 2;
  }
  if (this.framesAnimation == step2) {
    this.framesAnimation = 0;
  }

  document.getElementById(this.htmlDivId).style.backgroundPosition = "-" + tempStartXSpride + "px -" + this.startYSprite + "px";
}

Player.prototype.update = function (timestamp, map, pressedKeys) {
  // if (this.gameState === 0) {
  this.checkCollisions(map);
  this.moveOnMap(pressedKeys );
  this.lead();
  this.animate();
  // }

  // if (this.estadoJuego == listadoEstados.NIVEL) {
  //   this.comprobarColisiones(mapa);
  //   this.moverEnNivel();
  //   this.dirigir();
  //   this.animar();
  // }
}
