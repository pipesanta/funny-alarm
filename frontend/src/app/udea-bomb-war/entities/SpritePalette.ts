import { Sprite } from "./Sprite";
import { Point } from "./Point";

export class SpritePalette {
    imagePath: any;
    imageWidth;
    imageHeight: number;
    spriteWidth: number;
    spriteHeight: number;
    imageSpriteWidth: number;
    imageSpriteHeight: number;
    totalSprites: number;
    sprites: any[];
    getPositionWithSpriteId: (idSpriteSobreZero: any) => any;
    firstSpriteOverOne: number;

    constructor(spriteData) {

        this.imagePath = spriteData.image;

        this.imageWidth = parseInt(spriteData.imagewidth);
        this.imageHeight = parseInt(spriteData.imageheight);

        this.spriteWidth = parseInt(spriteData.tilewidth);
        this.spriteHeight = parseInt(spriteData.tileheight);

        this.firstSpriteOverOne = parseInt(spriteData.firstgid);

        this.imageSpriteWidth = this.imageWidth / this.spriteWidth;
        this.imageSpriteHeight = this.imageHeight / this.spriteHeight;
        this.totalSprites = this.imageSpriteWidth * this.imageSpriteHeight;

        this.sprites = [];
        

        for (let s = 0; s < this.totalSprites; s++) {
            var currentIdOverZero = this.firstSpriteOverOne - 1 + s;
            this.sprites.push(new Sprite(this.imagePath, currentIdOverZero,
                this.getPositionWithSpriteId(currentIdOverZero)));
        }

    }

}

SpritePalette.prototype.getPositionWithSpriteId = function (spriteIdOverZero) {
    var y = Math.floor(spriteIdOverZero / this.imageSpriteWidth);
    var x = spriteIdOverZero % this.imageSpriteWidth;

    return new Point(x * this.spriteWidth, y * this.spriteHeight);
}