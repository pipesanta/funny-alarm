export class Point {
  x: number;
  y: number;
  coincide: (punto: any) => boolean;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y

  }
}

Point.prototype.coincide = function (point: Point) {
  return (this.x === point.x && this.y === point.y)
}
