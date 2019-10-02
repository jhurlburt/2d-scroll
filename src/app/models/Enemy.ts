import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
import { Helper } from '../helpers/Helper';
import { ACTION } from '../models/Character';
import { Constants } from '../helpers/Constants';

export class Enemy implements BoundingBox {
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
  
    constructor(options) {
        this.id = options.id || "0";
        this.name = "Enemy";
        this.sprites = [
            new Sprite({
            context: options.context, image: options.images[0], x: options.x, y: options.y,
            ticksPerFrame: 60,
            sourceWidth: options.sourceWidth || Constants.CHAR_WIDTH,
            sourceHeight: options.sourceHeight || Constants.CHAR_HEIGHT,
            frameWidth: options.frameWidth || Constants.CHAR_WIDTH,
            frameHeight: options.frameHeight || Constants.CHAR_HEIGHT
            }),
            new Sprite({
            context: options.context, image: options.images[1], x: options.x, y: options.y,
            sourceWidth: options.sourceWidth,
            sourceHeight: options.sourceHeight,
            frameWidth: options.frameWidth,
            frameHeight: options.frameHeight
            })
        ];
        this.boundingBox = this.sprites[0];
    }
  
    toString = function () {
      if (this.boundingBox != null) {
        return this.boundingBox.toString();
      }
      return "";
    };
  
    isJumping = function () {
      return (this.lastAction == ACTION.JUMP_LEFT ||
        this.lastAction == ACTION.JUMP_RIGHT ||
        this.lastAction == ACTION.JUMP) && !this.isFalling;
    };
  
    update = function (hor: number, vert: number, platform_y: number) {
      if ((this.name == "Question") && (this.hasCollided() && this.hasCollidedBottom)) {
        console.log(this.toString());
        this.boundingBox.stopUpdate();
        this.boundingBox.image = this.images[1];
      }
      this.platform_y = platform_y;
      this.boundingBox.x += hor;
      this.boundingBox.y += vert;    
      this.boundingBox.update();
    };
    render = function () {
      this.boundingBox.render();
    };
    hasCollided = function() {
      return (this.hasCollidedBottom || this.hasCollidedTop) && (this.hasCollidedLeft || this.hasCollidedRight);
    };
    resetCollided = function() {
      this.hasCollidedBottom = false;
      this.hasCollidedTop = false;
      this.hasCollidedLeft = false;
      this.hasCollidedRight = false;
    };
  }