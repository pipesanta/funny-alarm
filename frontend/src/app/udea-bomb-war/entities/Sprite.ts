export class Sprite{
    sheetPath;
    idOnZero;
    idOnOne;
    positionOnSheet
    constructor(path, idOnZero, positionOnSheet){
        const elementsPath = path.split('/');
        this.sheetPath = 'img' + elementsPath[elementsPath.length -1];
        this.idOnZero = idOnZero;
        this.idOnOne = idOnZero + 1;
        this.positionOnSheet = positionOnSheet;
    }
}
