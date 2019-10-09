import { Sprite } from './Sprite';
import { BoundingBox } from '../interface/BoundingBox';
import { Constants } from '../helpers/Constants';
import { Helper } from '../helpers/Helper';

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
      let maxRight: number = (this.canvasWidth / 2) - this.boundingBox.x;
      return (scroll > maxRight) ? maxRight : scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_MOVE) {
      let maxLeft: number = Constants.CHAR_X - this.boundingBox.x; //this.boundingBox
      return (scroll < maxLeft) ? maxLeft  : scroll;
    };
  
    update (vert: number = 0, scroll: number = 0) {
      let action: ACTION = Helper.getAction(this.lastAction || ACTION.STAND_RIGHT, vert, scroll); 

      switch (action) {
        case ACTION.WALK_LEFT: {
          this.boundingBox = this.sprites[ACTION.WALK_LEFT];
          break;
        } case ACTION.WALK_RIGHT: {
          this.boundingBox = this.sprites[ACTION.WALK_RIGHT];
          break;
        } case ACTION.STAND_LEFT: {
          this.boundingBox = this.sprites[ACTION.STAND_LEFT];
          break;
        } case ACTION.STAND_RIGHT: {
          this.boundingBox = this.sprites[ACTION.STAND_RIGHT];
          break;
        } case ACTION.JUMP_LEFT: {
          this.boundingBox = this.sprites[ACTION.JUMP_LEFT];
          break;
        } case ACTION.JUMP_RIGHT: {
          this.boundingBox = this.sprites[ACTION.JUMP_RIGHT];
          break;
        } default: {
          console.log("switch (action) == default");
          break;
        }
      }
      this.lastAction = action;
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
  