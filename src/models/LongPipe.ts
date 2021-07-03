import { Pipe } from './Pipe';
import { Sprite } from './Sprite';

const colorPallette = [
  '#FFFFFF',  //0,=bg
  '#00ad00',  //1,=pipe color
  '#bdff18',  //2,=highlight
  '#000000',  //3,=shadow
  '#FFFFFF',  //4=not used
  '#FFFFFF',  //5=not used
  '#FFFFFF']; //6=not used

  const dataMap = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],
    [3,1,1,1,1,1,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1,2,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1,2,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1,2,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1,2,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1,2,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1,2,2,2,3],
    [3,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,2,2,3,0,0],
    [0,0,3,2,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,3,0,0]];

export class LongPipe extends Pipe {

  constructor(options) {
    super({
        context: options.context, 
        dataMap: [ dataMap ], 
        x: options.x, 
        y: options.y || 484, 
        colorPallette: colorPallette
    });
  }
}
  