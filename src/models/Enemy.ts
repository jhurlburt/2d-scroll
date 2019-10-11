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
  
    toString() {
      if (this.boundingBox != null) {
        return this.boundingBox.toString();
      }
      return "";
    };
  
    update(hor: number, vert: number, platform_y: number) {
      this.platform_y = platform_y;
      // this.boundingBox.x += hor;
      // this.boundingBox.y += vert;    
      this.boundingBox.update(vert, hor);
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