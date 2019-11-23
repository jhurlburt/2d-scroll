import { Sprite } from './Sprite';
import { BoundingBox } from '../interface/BoundingBox';
import { Constants } from '../helpers/Constants';
import { ACTION } from '../helpers/Character';

export class Character implements BoundingBox {
    sprites: Sprite[];
    bounds: Sprite;
    lastAction: ACTION = ACTION.STAND_RIGHT;
    id: string;
    name: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];
    canvasWidth: number = 0;
    canvasHeight: number = 0;
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
        this.bounds = this.sprites[ ACTION.STAND_RIGHT ];
        this.canvasWidth = options.canvasWidth || 0;
        this.canvasHeight = options.canvasHeight || 0;
    }

    canScrollDown(vert: number = Constants.GRAVITY) {
      return this.canvasHeight <= this.bounds.y + vert ? this.canvasHeight - this.bounds.y : vert; 
    };

    canScrollRight (scroll: number = Constants.CHAR_HORZ) {
      return (this.canvasWidth / 2) <= this.bounds.x + scroll ? (this.canvasWidth / 2) - this.bounds.x : scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_HORZ) {
      return Constants.CHAR_X_POS >= (this.bounds.x + scroll) ? Constants.CHAR_X_POS - this.bounds.x : scroll; //this.boundingBox
    };
  
    update (options : any) {
      let action: ACTION = ACTION.STAND_RIGHT, 
          lastBoundingBox: Sprite = this.bounds;

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
      this.bounds = this.sprites[action];
      this.bounds.x = lastBoundingBox.x;
      this.bounds.y = lastBoundingBox.y;

      this.bounds.update(options.char_scroll_vert, options.char_scroll_horz);
    };

    render () {
      this.bounds.render();
    };

    hasCollided () {
      return this.collisionObjectId != null && this.collisionObjectId.length > 0;
    };

    resetCollided () {
      this.hasCollidedBottom = [];
      this.hasCollidedTop = [];
      this.hasCollidedLeft = [];
      this.hasCollidedRight = [];
      this.collisionObjectId = [];
    };
  
    toString () {
      if (this.bounds != null) {
        return this.bounds.toString();
      }
      return "";
    };
} 