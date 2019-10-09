import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from './Sprite';
import { Helper } from '../helpers/Helper';

export class StandPipe implements BoundingBox {
    boundingBox: Sprite;
    platform_y: number;
    id: string;
    name: string = "StandPipe";
    hasCollidedTop: boolean = false;
    hasCollidedBottom: boolean = false;
    hasCollidedLeft: boolean = false;
    hasCollidedRight: boolean = false;
    collisionObjectName: string = "";
    collisionObjectId: number = 0;  
    constructor(options) {
        this.id = options.id || "0";
        this.boundingBox = new Sprite({
            context: options.context,
            image: options.images[0],
            x: options.x,
            y: options.y,
            ticksPerFrame: options.ticksPerFrame,
            sourceWidth: options.sourceWidth,
            sourceHeight: options.sourceHeight,
            frameWidth: options.frameWidth,
            frameHeight: options.frameHeight,
            numberOfFrames: 1
        });
    }
  
    toString = function () {
      var result = "";
      if (this.boundingBox != null) {
        result = this.boundingBox.toString();
      }
      return result;
    };
  
    update = function (hor: number, vert: number, platform_y: number = 0) {
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
  