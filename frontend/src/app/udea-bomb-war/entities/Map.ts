import { Point } from './Point';
import { Rectangle } from './Rectangle';

export const ASSETS_PATH = './assets/udea-bomb-war/';

export class Map {
  gameState: any;
  position: Point;
  updatedPosition: Point;
  tilesWidth: number;
  tilesHeight: number;
  tilesInWidth: number;
  tilesInHeight: number;
  rectanglesPositions: any[];
  rectanglesCollisions: any[];
  mapLimit: Rectangle;
  mapImagePath: any;
  loadLayers: (datosCapas: any) => void;
  loadItemsOnMap: () => void;
  update: (timestamp: any, pixelPlayerPosition: any) => void;
  draw: () => void;



  constructor(jsonObject, gameState) {

    this.gameState = gameState;
    this.position = new Point(0, 0);
    this.updatedPosition = new Point(0, 0);

    const backgroundCompletePath = ASSETS_PATH + jsonObject.tilesets[0].image;
    const backgroundImagePath = backgroundCompletePath.split('/');
    const backgroundImageName = backgroundImagePath[backgroundImagePath.length - 1];
    const mapName = backgroundImageName.split('.');

    if (this.gameState === 0) {
      this.mapImagePath = 'images/MapaBomb.png';
    }
    // if (this.estadoJuego == listadoEstados.NIVEL) {
    //     this.mapImagePath = "img/" + nombreMapa[0] + ".nivel.png";
    // }

    this.tilesInWidth = parseInt(jsonObject.width, 10);
    this.tilesInHeight = parseInt(jsonObject.height, 10);
    this.tilesWidth = parseInt(jsonObject.tilewidth, 10);
    this.tilesHeight = parseInt(jsonObject.tileheight, 10);

    

    this.rectanglesCollisions = [];
    this.rectanglesPositions = [];
    // rectangulos escaleras


    this.loadLayers(jsonObject.layers);

    this.loadItemsOnMap();

    this.mapLimit = new Rectangle(this.position.x,
      this.position.y,
      this.tilesInWidth * this.tilesWidth,
      this.tilesInHeight * this.tilesHeight, 'colision');

  }
}


Map.prototype.loadLayers = function (layers) {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].name === 'colisiones') {
      for (let c = 0; c < layers[i].objects.length; c++) {
        this.rectanglesCollisions.push(new Rectangle(
          layers[i].objects[c].x, layers[i].objects[c].y,
          layers[i].objects[c].width, layers[i].objects[c].height, 'colision'
        ));
      }
    }
    // if (layers[i].name == "localizaciones") {
    // 	for (let l = 0; l < layers[i].objects.length; l++) {
    // 		this.rectangulosLocalizaciones.push(new Localizacion(new Rectangle(
    // 			layers[i].objects[l].x, layers[i].objects[l].y,
    // 			layers[i].objects[l].width, layers[i].objects[l].height, "localizacion"
    // 		), layers[i].objects[l].name));
    // 	}
    // }
    // bloque if capas de escaleras
  }
};

Map.prototype.loadItemsOnMap = function () {
  let mapPixelsWidth = this.tilesInWidth * this.tilesWidth;
  let mapPixelsHeight = this.tilesInHeight * this.tilesHeight;

  const idHTML = 'mapa';
  document.getElementById(idHTML).style.position = 'absolute';
  document.getElementById(idHTML).style.width = (this.tilesInWidth * this.tilesWidth) + 'px';
  document.getElementById(idHTML).style.height = (this.tilesInHeight * this.tilesHeight) + 'px';
  document.getElementById(idHTML).style.background = `url(${ASSETS_PATH}${this.mapImagePath})`;
  document.getElementById(idHTML).style.backgroundClip = 'border-box';
  document.getElementById(idHTML).style.outline = '1px solid transparent';

  let htmlCollisions = '';
  for (let c = 0; c < this.rectanglesCollisions.length; c++) {
    htmlCollisions += this.rectanglesCollisions[c].html;
  }
  document.getElementById('colisiones').innerHTML = htmlCollisions;

  // let htmlLocalizaciones = '';
  // for (let l = 0; l < this.rectangulosLocalizaciones.length; l++) {
  //   htmlLocalizaciones += this.rectangulosLocalizaciones[l].rectangulo.html;
  // }
  // document.getElementById('localizaciones').innerHTML = htmlLocalizaciones;

  // bloque de escaleras

  // if(debug.debugging) {
  // 	for (let c = 0; c < this.rectangulosColisiones.length; c++) {
  // 		this.rectangulosColisiones[c].aplicarEstiloTemporal("#ff0000");
  // 	}

  // 	for (let l = 0; l < this.rectangulosLocalizaciones.length; l++) {
  // 		this.rectangulosLocalizaciones[l].rectangulo.aplicarEstiloTemporal("#00ff00");
  // 	}

  // 	//bloque escaleras debugging
  // }


  document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  document.getElementsByTagName('body')[0].style.backgroundColor = 'black';
};

Map.prototype.update = function (timestamp, pixelPlayerPosition) {
  this.position.x = pixelPlayerPosition.x;
  this.position.y = pixelPlayerPosition.y;

  this.mapLimit.x = this.posicion.x;
  this.mapLimit.y = this.posicion.y;
};

Map.prototype.draw = function () {
  document.getElementById('mapa').style.transform = 'translate3d(' + this.posicion.x + 'px, ' + this.posicion.y + 'px, 0' + ')';

  // if(debug.debugging) {
  	// for (let rc = 0; rc < this.rectanglesCollisions.length; rc++) {
  	// 	this.rectanglesCollisions[rc].move(this.position.x, this.position.y);
  	// }

  	// for (let rl = 0; rl < this.rectangulosLocalizaciones.length; rl++) {
  	// 	this.rectangulosLocalizaciones[rl].rectangulo.mover(this.posicion.x, this.posicion.y);
  	// }

  	//bloque dibujado escaleras
  // }
};
