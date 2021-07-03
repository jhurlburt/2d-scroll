import { Sprite } from '../models/Sprite';
import { Block } from './Block';

//0,=bg //1,=shirt //2,=hair/shoes //3,=skin //4,=button //5,=eyes/mustache //6,=pants
const colorPallette = [
  '#FFFFFF',  //0,=bg
  '#994b0c',  //1,=cap (brown)
  '#ffc8b8',  //2,=eye (white)
  '#000000',  //3,=eyebows (dk gray)
  '#000000',  //4,=unused
  '#000000',  //5,=unused
  '#000000']; //6,=unused

const step1CM = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,3,3,1,1,1,1,1,1,3,3,1,0,0],
  [0,1,1,1,2,3,1,1,1,1,3,2,1,1,1,0],
  [0,1,1,1,2,3,3,3,3,3,3,2,1,1,1,0],
  [1,1,1,1,2,3,2,1,1,2,3,2,1,1,1,1],
  [1,1,1,1,2,2,2,1,1,2,2,2,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,2,2,2,2,2,2,1,1,1,1,0],
  [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,5,5,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,5,5,5,5,5,2,2,2,2,2,5,5,0,0,0],
  [0,5,5,5,5,5,5,2,2,2,5,5,5,0,0,0],
  [0,0,5,5,5,5,5,2,2,5,5,5,0,0,0,0]];

const step2CM = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,3,3,1,1,1,1,1,1,3,3,1,0,0],
  [0,1,1,1,2,3,1,1,1,1,3,2,1,1,1,0],
  [0,1,1,1,2,3,3,3,3,3,3,2,1,1,1,0],
  [1,1,1,1,2,3,2,1,1,2,3,2,1,1,1,1],
  [1,1,1,1,2,2,2,1,1,2,2,2,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,2,2,2,2,2,2,1,1,1,1,0],
  [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,2,5,5,0,0],
  [0,0,0,5,5,2,2,2,2,2,5,5,5,5,5,0],
  [0,0,0,5,5,5,2,2,2,5,5,5,5,5,5,0],
  [0,0,0,0,5,5,5,2,2,5,5,5,5,5,0,0]];

export class Enemy extends Block {
  public moveLeft: boolean;

  constructor(options) {
    super({
      x: options.x,
      y: options.y || 0,
      sprites: [
        new Sprite({ context: options.context, dataMaps: [ step1CM, step2CM ], x: options.x, y: options.y, colorPallette: colorPallette })] //WALK LEFT
    });
    this.moveLeft = options.moveLeft;
  }
  
  public update(options : any) {
    let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
        scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;

    // if (this.collisionObjectId.length > 0){
    // }  
    if (this.isTerminated){
      // console.log("Hey, dog. This aint for me, neither! - Goomba")
    }
    this.bounds.forEach(sprite => { sprite.update(scroll_vert, scroll_horz);   });
  };
}