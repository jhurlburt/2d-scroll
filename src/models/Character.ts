import { Sprite } from './Sprite';
import { Constants } from '../helpers/Constants';
import { ACTION } from '../helpers/Character';
import { Block } from './Block';

export class Character extends Block {
    private canvasWidth: number = 0;
    private canvasHeight: number = 0;
  
    constructor(options) {
      super(options);  
          
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

    public update (options : any) {
      let action: ACTION = ACTION.STAND_RIGHT;
      let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
          scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;

      // if (this.collisionObjectId.length > 0){
      //   console.log("Yo, dog. This aint for me, man")
      // }
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