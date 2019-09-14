import { Rectangle } from "./Rectangle";

export class Tile{
    rectangle;
    zIndex;
    sprite;
    idHTML;
    html;
    applyStyles: () => void;
    move: (x: any, y: any) => void;

    constructor(xOnTiles, yOnTiles, z, width, height, sprite){
        this.rectangle = new Rectangle(xOnTiles, yOnTiles, width, height, sprite);
        this.zIndex = this.zIndex;
        this.sprite = sprite;
        this.idHTML = 'x' + xOnTiles + 'y' + yOnTiles, 'z' + z;
       
    }
}

Tile.prototype.applyStyles = function() {
	if (!document.getElementById(this.idHTML)) {
		throw("El ID " + this.idHTML + " no existe en la hoja");
	}

	document.getElementById(this.idHTML).style.position = "absolute";
	document.getElementById(this.idHTML).style.left = (this.rectangle.x * this.rectangle.width) + "px";
	document.getElementById(this.idHTML).style.top = (this.rectangle.y * this.rectangle.height) + "px";
	document.getElementById(this.idHTML).style.width = this.rectangle.width + "px";
	document.getElementById(this.idHTML).style.height = this.rectangle.width + "px";
	document.getElementById(this.idHTML).style.zIndex = "" + this.zIndex;
	document.getElementById(this.idHTML).style.background = "url('" + this.sprite.sheetPath + "')";

	const x = this.sprite.positionOnSheet.x;
	const y = this.sprite.positionOnSheet.y;
	
	document.getElementById(this.idHTML).style.backgroundPosition = "-" + x + "px -" + y + "px";
	document.getElementById(this.idHTML).style.backgroundClip = "border-box";
	document.getElementById(this.idHTML).style.outline = "1px solid transparent";
}

Tile.prototype.move = function(x, y) {
	document.getElementById(this.idHTML).style.transform = 'translate3d(' + x + 'px,' + y + 'px, 0)';
}