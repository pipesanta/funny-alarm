import { Tile } from "./Tile";

export class MapTilesLayer {
    tilesWidth: number;
    tilesHeight: number;
    x: number;
    y: number;
    z: any;
    tiles: any[];
    findSpriteInPaletteById: (spriteIdOverOne: any, spritesPalette: any) => any;

    constructor(layerData, zIndex, tileWidth, heightTile, spritesPalette ) {
        this.tilesWidth = parseInt(layerData.width);
        this.tilesHeight = parseInt(layerData.height);
        this.x = parseInt(layerData.x);
        this.y = parseInt(layerData.y);
        this.z = zIndex;
        this.tiles = [];

        for (let y = 0; y < this.tilesHeight; y++) {
            for (let x = 0; x < this.tilesWidth; x++) {
                var spriteIdOverOne = layerData.data[x + y * this.tilesWidth];
                if (spriteIdOverOne == 0) {
                    this.tiles.push(null);
                } else {
                    var currentSprite = this.findSpriteInPaletteById(spriteIdOverOne - 1, spritesPalette);
    
                    this.tiles.push(new Tile(x, y, zIndex, tileWidth, this.tilesHeight, currentSprite));
                }
            }
        }
    }

}

MapTilesLayer.prototype.findSpriteInPaletteById = function (spriteIdOverOne, spritePalette) {
    for (let s = 0; s < spritePalette.length; s++) {
        if (spriteIdOverOne >= spritePalette[s].firstSprite - 1 &&
            spriteIdOverOne < spritePalette[s].totalSprites + spritePalette[s].firstSpriteOverOne + 1) {
            return spritePalette[s].sprites[Math.abs(spritePalette[s].firstSpriteOverOne - 1 - spriteIdOverOne)];
        }
    }
    throw "El ID sobre ZERO " + spriteIdOverOne + " del sprite no existe en ninguna paleta";
}