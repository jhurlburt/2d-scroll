import { Sprite } from './Sprite';
import { BoundingBox } from '../interface/BoundingBox';
import { Constants } from '../helpers/Constants';

export enum ACTION {
    STAND_LEFT,
    STAND_RIGHT,
    WALK_LEFT,
    WALK_RIGHT,
    JUMP_LEFT,
    JUMP_RIGHT,
    FALL_LEFT,
    FALL_RIGHT,
    FALL_DOWN,
    JUMP
  }
  
export class Character implements BoundingBox {
    sprites: Sprite[];
    boundingBox: Sprite;
    lastAction: ACTION = ACTION.STAND_RIGHT;
    id: string;
    name: string;
    hasCollidedTop: boolean = false;
    hasCollidedBottom: boolean = false;
    hasCollidedLeft: boolean = false;
    hasCollidedRight: boolean = false;
    collisionObjectName: string = "";
    collisionObjectId: number = 0;
    canvasWidth: number = 0;
    xPos: number = 0;
    yPos: number = 0;

  
    constructor(options) {
        this.id = options.id || "0";
        this.name = "Character";  
        this.sprites = [
            new Sprite({
            context: options.context, image: options.images[0], x: options.x, y: options.y,
            sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight,
            frameWidth: options.frameWidth, frameHeight: options.frameHeight }),
            new Sprite({
            context: options.context, image: options.images[1], x: options.x, y: options.y,
            sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight,
            frameWidth: options.frameWidth, frameHeight: options.frameHeight }),
            new Sprite({
            context: options.context, image: options.images[2], x: options.x, y: options.y,
            ticksPerFrame: Constants.CHAR_TPF,
            sourceWidth: options.sourceWidth || Constants.CHAR_WIDTH,
            sourceHeight: options.sourceHeight || Constants.CHAR_HEIGHT,
            frameWidth: options.frameWidth || Constants.CHAR_WIDTH,
            frameHeight: options.frameHeight || Constants.CHAR_HEIGHT }),
            new Sprite({
            context: options.context, image: options.images[3], x: options.x, y: options.y,
            ticksPerFrame: Constants.CHAR_TPF,
            sourceWidth: options.sourceWidth || Constants.CHAR_WIDTH,
            sourceHeight: options.sourceHeight || Constants.CHAR_HEIGHT,
            frameWidth: options.frameWidth || Constants.CHAR_WIDTH,
            frameHeight: options.frameHeight || Constants.CHAR_HEIGHT }),
            new Sprite({
            context: options.context, image: options.images[4], x: options.x, y: options.y,
            sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight,
            frameWidth: options.frameWidth, frameHeight: options.frameHeight }),
            new Sprite({
            context: options.context, image: options.images[5], x: options.x, y: options.y,
            sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight,
            frameWidth: options.frameWidth, frameHeight: options.frameHeight })
        ];
        this.boundingBox = this.sprites[ACTION.STAND_RIGHT];
        this.canvasWidth = options.canvasWidth || 0;
    }
  
    toString () {
      if (this.boundingBox != null) {
        return this.boundingBox.toString();
      }
      return "";
    };
  

    canScrollRight (scroll: number = Constants.CHAR_HORZ) {
      return (this.canvasWidth / 2) <= this.boundingBox.x + scroll ? (this.canvasWidth / 2) - this.boundingBox.x : scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_HORZ) {
      return Constants.CHAR_X_POS >= (this.boundingBox.x + scroll) ? Constants.CHAR_X_POS - this.boundingBox.x : scroll; //this.boundingBox
    };
  
    update (options : any) {
      let action: ACTION = ACTION.STAND_RIGHT, 
        lastBoundingBox: Sprite = this.boundingBox;

      let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
        scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;

      if (scroll_vert < 0 && scroll_horz < 0) {
        action = ACTION.JUMP_LEFT;
  
      } else if (scroll_vert < 0 && scroll_horz > 0) {
        action = ACTION.JUMP_RIGHT;
  
      } else if (scroll_vert < 0 && scroll_horz == 0) {
        action = (this.lastAction == ACTION.WALK_LEFT || this.lastAction == ACTION.JUMP_LEFT || this.lastAction == ACTION.STAND_LEFT) ?
          ACTION.JUMP_LEFT :
          ACTION.JUMP_RIGHT;
  
      } else if (scroll_horz < 0) {
        action = ACTION.WALK_LEFT;
  
      } else if (scroll_horz > 0) {
        action = ACTION.WALK_RIGHT;
  
      } else if (scroll_horz == 0) {
        action = (this.lastAction == ACTION.WALK_LEFT || this.lastAction == ACTION.JUMP_LEFT || this.lastAction == ACTION.STAND_LEFT) ?
          ACTION.STAND_LEFT :
          ACTION.STAND_RIGHT;
      }
      this.lastAction = action;
      this.boundingBox = this.sprites[action];
      this.boundingBox.x = lastBoundingBox.x;
      this.boundingBox.y = lastBoundingBox.y;

      this.boundingBox.update(options.char_scroll_vert, options.char_scroll_horz);
    };

    render () {
      this.boundingBox.render();
    };

    hasCollided () {
      return (this.hasCollidedBottom || this.hasCollidedTop) || (this.hasCollidedLeft || this.hasCollidedRight);
    };

    resetCollided () {
      this.hasCollidedBottom = false;
      this.hasCollidedTop = false;
      this.hasCollidedLeft = false;
      this.hasCollidedRight = false;
    };
  }
  