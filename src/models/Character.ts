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
    isFalling: boolean = false;
    id: string;
    name: string;
    platform_y: number;
    hasCollidedTop: boolean = false;
    hasCollidedBottom: boolean = false;
    hasCollidedLeft: boolean = false;
    hasCollidedRight: boolean = false;
    collisionObjectName: string = "";
    collisionObjectId: number = 0;
    canvasWidth: number = 0;
  
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
  
    isJumping () {
      return (this.lastAction == ACTION.JUMP_LEFT ||
        this.lastAction == ACTION.JUMP_RIGHT ||
        this.lastAction == ACTION.JUMP) && !this.isFalling;
    };

    canScrollRight (scroll: number = Constants.CHAR_MOVE) {

      // this.canvasWidth / 2:600
      // this.boundingBox.x:650
      // maxRight:-50
      // scroll:52
      // char_scroll:-50

      let maxRight: number = (this.canvasWidth / 2) <= this.boundingBox.x + scroll ? (this.canvasWidth / 2) - this.boundingBox.x : 0;
      console.log("this.canvasWidth / 2:" + this.canvasWidth / 2);
      console.log("this.boundingBox.x:" + this.boundingBox.x);
      console.log("maxRight:" + maxRight);
      return (scroll > maxRight) ? maxRight : scroll;
      // return scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_MOVE) {
      let maxLeft: number = Constants.CHAR_X - this.boundingBox.x; //this.boundingBox
      // return (scroll < maxLeft) ? maxLeft  : scroll;
      return scroll;
    };
  
    update (vert: number = 0, scroll: number = 0) {
      if (vert < 0 && scroll < 0) {
        this.lastAction = ACTION.JUMP_LEFT;
  
      } else if (vert < 0 && scroll > 0) {
        this.lastAction = ACTION.JUMP_RIGHT;
  
      } else if (vert < 0 && scroll == 0) {
        this.lastAction = (this.lastAction == ACTION.WALK_LEFT || this.lastAction == ACTION.JUMP_LEFT || this.lastAction == ACTION.STAND_LEFT) ?
          ACTION.JUMP_LEFT :
          ACTION.JUMP_RIGHT;
  
      } else if (scroll < 0) {
        this.lastAction = ACTION.WALK_LEFT;
  
      } else if (scroll > 0) {
        this.lastAction = ACTION.WALK_RIGHT;
  
      } else if (scroll == 0) {
        this.lastAction = (this.lastAction == ACTION.WALK_LEFT || this.lastAction == ACTION.JUMP_LEFT || this.lastAction == ACTION.STAND_LEFT) ?
          ACTION.STAND_LEFT :
          ACTION.STAND_RIGHT;
      }
      this.boundingBox = this.sprites[this.lastAction];
      this.boundingBox.update(vert, scroll);
    };

    render () {
      this.boundingBox.render();
    };

    hasCollided () {
      return (this.hasCollidedBottom || this.hasCollidedTop) && (this.hasCollidedLeft || this.hasCollidedRight);
    };

    resetCollided () {
      this.hasCollidedBottom = false;
      this.hasCollidedTop = false;
      this.hasCollidedLeft = false;
      this.hasCollidedRight = false;
    };
  }
  