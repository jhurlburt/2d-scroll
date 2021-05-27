import { Sprite } from './Sprite';
import { Constants } from '../helpers/Constants';
import { ACTION } from '../helpers/Character';
import { Block } from './Block';

const SIZE_MULTIPLIER = 5;

export class Character extends Block {

    private canvasWidth: number = 0;
    private canvasHeight: number = 0;
    context: CanvasRenderingContext2D;
  
    constructor(options) {
      super(options);  
          
      this.context = options.context || null;

      this.bounds = [];
      this.bounds.push(
        new Sprite({ context: options.context, image: options.images[0], x: options.x, y: options.y
          , sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight
          , frameWidth: options.frameWidth, frameHeight: options.frameHeight 
        }),
        new Sprite({ context: options.context, image: options.images[1], x: options.x, y: options.y
          , sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight
          , frameWidth: options.frameWidth, frameHeight: options.frameHeight 
        }),
        new Sprite({ context: options.context, image: options.images[2], x: options.x, y: options.y
          , sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight
          , frameWidth: options.frameWidth, frameHeight: options.frameHeight, ticksPerFrame: Constants.CHAR_TPF 
        }),
        new Sprite({ context: options.context, image: options.images[3], x: options.x, y: options.y
          , sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight
          , frameWidth: options.frameWidth, frameHeight: options.frameHeight, ticksPerFrame: Constants.CHAR_TPF 
        }),
        new Sprite({ context: options.context, image: options.images[4], x: options.x, y: options.y
          , sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight
          , frameWidth: options.frameWidth, frameHeight: options.frameHeight 
        }),
        new Sprite({ context: options.context, image: options.images[5], x: options.x, y: options.y
          , sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight
          , frameWidth: options.frameWidth, frameHeight: options.frameHeight 
      }));
      this.canvasWidth = options.canvasWidth    || 0;
      this.canvasHeight = options.canvasHeight  || 0;
      this.lastAction = ACTION.STAND_RIGHT;
    }

    public render() {

      var CELL_WIDTH = 1 * SIZE_MULTIPLIER; // size of the cell in pixels
      var CELL_HEIGHT = 1 * SIZE_MULTIPLIER; // size of the cell in pixels
      var ctx = this.context;
      //0=bg 1=shirt 2=hair/shoes 3=button 4=skin 5=eyes/mustache 6=pants
      var marioColorPallette = ['#FFF','#cc1616','#6e3d23','#ffc17a','#dbde31','#000','#182a99']
      var marioStandingCM = [
          [0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,2,2,2,3,3,3,5,3,0,0,0,0,0,0],
          [0,2,3,2,3,3,3,3,5,3,3,3,0,0,0,0],
          [0,2,3,2,2,3,3,3,3,5,3,3,3,0,0,0],
          [0,2,2,3,3,3,3,3,5,5,5,5,0,0,0,0],
          [0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0],
          [0,0,1,1,6,1,1,1,1,1,0,0,0,0,0,0],
          [0,1,1,1,6,1,1,6,1,1,1,0,0,0,0,0],
          [1,1,1,1,6,6,6,6,1,1,1,1,0,0,0,0],
          [3,3,1,6,4,6,6,4,6,1,3,3,0,0,0,0],
          [3,3,3,6,6,6,6,6,6,3,3,3,0,0,0,0],
          [3,3,6,6,6,6,6,6,6,6,3,3,0,0,0,0],
          [0,0,6,6,6,0,0,6,6,6,0,0,0,0,0,0],
          [0,2,2,2,0,0,0,0,2,2,2,0,0,0,0,0],
          [2,2,2,2,0,0,0,0,2,2,2,2,0,0,0,0]
      ]
      for (var i=0; i<marioStandingCM.length; i++){
          var y =  this.getBounds().y + (CELL_HEIGHT * i);
          for (var j=0; j<marioStandingCM[0].length; j++){
              var x = this.getBounds().x + (CELL_WIDTH * j);
              var color = marioStandingCM[i][j];
              if (color != 0){
                  ctx.fillStyle = marioColorPallette[color];
                  ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
  
              }
          }
      }
    }

    public update (options : any) {
      let action: ACTION = ACTION.STAND_RIGHT;
      let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
          scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;

      if (this.isTerminated){
        console.log("Hey, dog. This aint for me, neither!")
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
      this.bounds.forEach(sprite => { sprite.update(options.char_scroll_vert, options.char_scroll_horz);  });
      this.lastAction = action;
    };

    public canScrollDown(vert: number ) {
      return this.canvasHeight <= this.bounds[this.lastAction].y + vert 
      ? this.canvasHeight - this.bounds[this.lastAction].y 
      : vert; 
    };

    public canScrollRight (scroll: number ) {
      return (this.canvasWidth / 2) <= this.bounds[this.lastAction].x + scroll 
      ? (this.canvasWidth / 2) - this.bounds[this.lastAction].x 
      : scroll;
    };
  
    public canScrollLeft (scroll: number ) {
      return Constants.CHAR_X_POS >= (this.bounds[this.lastAction].x + scroll) 
      ? Constants.CHAR_X_POS - this.bounds[this.lastAction].x 
      : scroll;
    };
} 