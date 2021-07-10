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

const GRAVITY: number = 500;
const VELOCITY: number = 500;
const STARTING_X: number = 800;
const STARTING_Y: number = 300;

export class Enemy extends Block {
  private _moveLeft: boolean;
  private _velocity: number = VELOCITY;
  private _gravity: number = GRAVITY;

  constructor(options) {
    super({
      x: options.x || STARTING_X,
      y: options.y || STARTING_Y,
      sprites: [
        new Sprite({ context: options.context, dataMaps: [ step1CM, step2CM ], x: options.x || STARTING_X, y: options.y || STARTING_Y, colorPallette: colorPallette })] //WALK LEFT
    });
    this._moveLeft = options.moveLeft;
  }

  get gravity(): number {
    return this._gravity;
  }

  get moveLeft(): boolean {
    return this._moveLeft;
  }

  set moveLeft(value: boolean) {
    this._moveLeft = value;
  }

  get velocity(): number {
    return this._velocity;
  }

  // set velocity(value: number){
  //   this._velocity = value;
  // }
  
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