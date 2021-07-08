import { Sprite } from './Sprite';
import { Constants } from '../helpers/Constants';
import { ACTION } from '../helpers/Character';
import { Block } from './Block';

//0,=bg //1,=shirt //2,=hair/shoes //3,=skin //4,=button //5,=eyes/mustache //6,=pants
const colorPallette = [
  '#FFF',     //0,=bg
  '#cc1616',  //1,=shirt (red)
  '#6e3d23',  //2,=hair/shoes (brown)
  '#ffc17a',  //3,=skin (peach)
  '#dbde31',  //4,=button (yellow)
  '#333',     //5,=eyes/mustache (dk gray)
  '#182a99']; //6,=pants (blue)

  //const colorPallette = ['#FFF','pink','green','pink','gold','red','blue']; //blue shirt, red pants

  const standingCM = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,2,2,2,3,3,5,3,0,0,0,0,0],
  [0,0,0,2,3,2,3,3,3,5,3,3,3,0,0,0],
  [0,0,0,2,3,2,2,3,3,3,5,3,3,3,0,0],
  [0,0,0,2,2,3,3,3,3,5,5,5,5,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,1,1,6,1,1,1,0,0,0,0,0,0],
  [0,0,0,1,1,1,6,1,1,6,1,1,1,0,0,0],
  [0,0,1,1,1,1,6,6,6,6,1,1,1,1,0,0],
  [0,0,3,3,1,6,4,6,6,4,6,1,3,3,0,0],
  [0,0,3,3,3,6,6,6,6,6,6,3,3,3,0,0],
  [0,0,3,3,6,6,6,6,6,6,6,6,3,3,0,0],
  [0,0,0,0,6,6,6,0,0,6,6,6,0,0,0,0],
  [0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0],
  [0,0,2,2,2,2,0,0,0,0,2,2,2,2,0,0]];
const step1CM = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,2,2,2,3,3,5,3,0,0,0,0,0],
  [0,0,0,2,3,2,3,3,3,5,3,3,3,0,0,0],
  [0,0,0,2,3,2,2,3,3,3,5,3,3,3,0,0],
  [0,0,0,2,2,3,3,3,3,5,5,5,5,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,1,1,1,1,6,1,0,3,0,0,0,0],
  [0,0,0,3,1,1,1,1,1,1,3,3,3,0,0,0],
  [0,0,3,3,6,1,1,1,1,1,3,3,0,0,0,0],
  [0,0,2,2,6,6,6,6,6,6,6,0,0,0,0,0],
  [0,0,2,6,6,6,6,6,6,6,6,0,0,0,0,0],
  [0,2,2,6,6,6,0,6,6,6,0,0,0,0,0,0],
  [0,2,0,0,0,0,2,2,2,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0]];
const step2CM = [ 
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,2,2,2,3,3,5,3,0,0,0,0,0],
  [0,0,0,2,3,2,3,3,3,5,3,3,3,0,0,0],
  [0,0,0,2,3,2,2,3,3,3,5,3,3,3,0,0],
  [0,0,0,2,2,3,3,3,3,5,5,5,5,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,1,1,6,1,1,1,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,6,6,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,6,6,4,6,6,3,0,0,0,0],
  [0,0,0,1,1,1,1,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,1,1,3,3,3,6,6,6,0,0,0,0],
  [0,0,0,0,6,1,3,3,6,6,6,0,0,0,0,0],
  [0,0,0,0,0,6,6,6,2,2,2,0,0,0,0,0],
  [0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0]];
const step3CM = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,2,2,2,3,3,5,3,0,0,0,0,0],
  [0,0,0,2,3,2,3,3,3,5,3,3,3,0,0,0],
  [0,0,0,2,3,2,2,3,3,3,5,3,3,3,0,0],
  [0,0,0,2,2,3,3,3,3,5,5,5,5,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,1,1,1,1,6,6,1,1,0,0,0,0,0,0],
  [3,3,1,1,1,1,6,6,6,1,1,1,3,3,3,0],
  [3,3,3,0,1,1,6,4,6,6,6,1,1,3,3,0],
  [3,3,0,0,6,6,6,6,6,6,6,0,0,2,0,0],
  [0,0,0,0,6,6,6,6,6,6,6,6,2,2,0,0],
  [0,0,0,6,6,6,6,6,6,6,6,6,2,2,0,0],
  [0,0,2,2,6,6,6,0,0,6,6,6,2,2,0,0],
  [0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0]];

const STARTING_X: number = 250;
const STARTING_Y: number = 300;
const VELOCITY: number = 600 / 1000; // DISTANCE % TIME
const HEIGHT: number = 64;
const WIDTH: number = 64;
const MOD_VERT: number = 5;
const MAX_VERT: number = 64 * 5;
const JUMP: number = 0 - (4000 / 1000);

export class Character extends Block {
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;
  private _velocity: number = 0;
  private _jump: number = 0;
  private _jumpVertex: number = 0;

  constructor(options) {
    super({
      id: options.id,
      x: STARTING_X,
      y: STARTING_Y,
      ticksPerFrame: options.ticksPerFrame,
      sprites: [ 
        new Sprite({ context: options.context, dataMaps: [ standingCM ], x: STARTING_X, y: STARTING_Y, direction: "left", colorPallette: colorPallette }), //STAND_LEFT
        new Sprite({ context: options.context, dataMaps: [ standingCM ], x: STARTING_X, y: STARTING_Y, direction: "right", colorPallette: colorPallette }), //STAND_RIGHT
        new Sprite({ context: options.context, dataMaps: [ step1CM, step2CM, step3CM ], x: STARTING_X, y: STARTING_Y, direction: "left", colorPallette: colorPallette }), //WALK LEFT
        new Sprite({ context: options.context, dataMaps: [ step1CM, step2CM, step3CM ], x: STARTING_X, y: STARTING_Y, direction: "right", colorPallette: colorPallette }),//WALK RIGHT
        new Sprite({ context: options.context, dataMaps: [ standingCM ], x: STARTING_X, y: STARTING_Y, direction: "left", colorPallette: colorPallette }), //JUMP LEFT
        new Sprite({ context: options.context, dataMaps: [ standingCM ], x: STARTING_X, y: STARTING_Y, direction: "right", colorPallette: colorPallette })] //JUMP RIGHT
    });          
    this.lastAction = ACTION.STAND_RIGHT;
    this.canvasHeight = options.canvasHeight;
    this.canvasWidth = options.canvasWidth;
    this.velocity = VELOCITY;
    this.jump = JUMP;
    // this.jumpVertex = 64 * 5;  
  }

  public initializeJump() {
    this._jump = JUMP;
  }

  public animateDeath() : boolean {
    // this.bounds.forEach(sprite => { 
    //   sprite.stopUpdate();  
    // });
    return true;
  }

  set velocity(value : number){ 
    this._velocity = value; 
  }
  get velocity(): number { 
    return this._velocity; 
  }

  set jump(value : number){ 
    this._jump = value; 
  }
  get jump() : number { 
    return this._jump; 
  }

  public update (options : any) {
    let action: ACTION = ACTION.STAND_RIGHT;
    let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
        scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;

        
    //let dt: number = options.deltaT;
    //mario position = mario position + mario velocity * dt
    //mario velocity = mario velocity + mario gravity * dt

    if (this.isTerminated){
        // console.log("Hey, dog. This aint for me! - mario")
    }
    if (scroll_vert < 0 && scroll_horz < 0) {
      action = ACTION.JUMP_LEFT;  
    } else if (scroll_vert < 0 && scroll_horz > 0) {
      action = ACTION.JUMP_RIGHT;  
    } else if (scroll_vert < 0 && scroll_horz == 0) {
      action = (this.lastAction == ACTION.WALK_LEFT || 
                this.lastAction == ACTION.JUMP_LEFT || 
                this.lastAction == ACTION.STAND_LEFT) ? ACTION.JUMP_LEFT : ACTION.JUMP_RIGHT;  
    } else if (scroll_horz < 0) {
      action = ACTION.WALK_LEFT;  
    } else if (scroll_horz > 0) {
      action = ACTION.WALK_RIGHT;  
    } else if (scroll_horz == 0) {
      action = (this.lastAction == ACTION.WALK_LEFT || this.lastAction == ACTION.JUMP_LEFT || this.lastAction == ACTION.STAND_LEFT) ?
        ACTION.STAND_LEFT :
        ACTION.STAND_RIGHT;
    }
    this.bounds.forEach(sprite => { 
      sprite.update(options.char_scroll_vert, options.char_scroll_horz);  
    });
    this.lastAction = action;
  };

  public canScrollDown(vert: number ) {
    return vert;
    // return this.canvasHeight <= this.bounds[this.lastAction].y + vert ? this.canvasHeight - this.bounds[this.lastAction].y : vert; 
  };

  public canScrollRight (scroll: number ) {   
    return (this.canvasWidth / 2) <= this.bounds[this.lastAction].x + scroll ? (this.canvasWidth / 2) - this.bounds[this.lastAction].x : scroll;
  };

  public canScrollLeft (scroll: number ) {
    return STARTING_X >= (this.bounds[this.lastAction].x + scroll) ? STARTING_X - this.bounds[this.lastAction].x : scroll;
  };
} 