import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from './Sprite';
import { Helper } from '../helpers/Helper';

export class Terra implements BoundingBox {
    bounds: Sprite;
    id: string;
    name: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];

    constructor(options) {
      this.id = options.id || "0";
      this.name = options.name || "Terra";
      this.bounds = new Sprite({
        context:        options.context,
        image:          options.images[0],
        x:              options.x,
        y:              options.y,
        ticksPerFrame:  options.ticksPerFrame,
        sourceWidth:    options.sourceWidth,
        sourceHeight:   options.sourceHeight,
        frameWidth:     options.frameWidth,
        frameHeight:    options.frameHeight,
        numberOfFrames: options.numberOfFrames || 1
      });
    }
    
    update = function (options) {
      this.bounds.update(options.vert, options.scroll);
    };
  
    render = function () {
      this.bounds.render();
    };
  
    hasCollided = function() {
      return this.hasCollidedBottom || this.hasCollidedTop || this.hasCollidedLeft || this.hasCollidedRight;
    };
  
    resetCollided = function() {
      this.hasCollidedBottom = [];
      this.hasCollidedTop = [];
      this.hasCollidedLeft = [];
      this.hasCollidedRight = [];
      this.collisionObjectId = [];
    };  

    toString = function () {
      let result = (this.boundingBox != null) ? this.boundingBox.toString() : "";      
      result = result + ", hasCollidedLeft: " + this.hasCollidedLeft +
        ", hasCollidedRight: " + this.hasCollidedRight +
        ", hasCollidedTop: " + this.hasCollidedTop +
        ", hasCollidedBottom: " + this.hasCollidedBottom;
      return result;
    };
  }
  