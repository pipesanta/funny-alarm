export class Rectangle {
  x;
  y;
  width;
  height;
  idHTML
  html;
  cross: (rectangle: any) => boolean;
  applyTempStyle: (colorHexadecimal: any) => void;
  move: (x: any, y: any) => void;

  constructor(x, y, width, height, type?) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.idHTML = type + "x" + x + "y" + y;
    this.html = '<div id="' + this.idHTML + '"></div>';

  }


}

Rectangle.prototype.cross = function (rectangle) {
  // console.log('----------------- 1 -----------------', this);
  // console.log('----------------- 2 -----------------', rectangle);
  
  return (this.x < rectangle.x + rectangle.width &&
    this.x + this.width > rectangle.x &&
    this.y < rectangle.y + rectangle.height &&
    this.height + this.y > rectangle.y) ? true : false;

}

Rectangle.prototype.applyTempStyle = function (hexColor) {
  if (!document.getElementById(this.idHTML)) {
    throw ("El ID " + this.idHTML + " no existe en la hoja");
  }

  //var color = "#ff0000";
  document.getElementById(this.idHTML).style.backgroundColor = hexColor;

  document.getElementById(this.idHTML).style.position = "absolute";
  document.getElementById(this.idHTML).style.left = this.x + "px";
  document.getElementById(this.idHTML).style.top = this.y + "px";
  document.getElementById(this.idHTML).style.width = this.width + "px";
  document.getElementById(this.idHTML).style.height = this.height + "px";
  document.getElementById(this.idHTML).style.zIndex = "5";
}

Rectangle.prototype.move = function (x, y) {
  document.getElementById(this.idHTML).style.transform = 'translate3d(' + x + 'px,' + y + 'px, 0)';
}
