import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
// import { ACTION } from '../models/Character';
import { Constants } from '../helpers/Constants';

export class Enemy implements BoundingBox {
    sprites: Sprite[];
    bounds: Sprite;
    // lastAction: ACTION = ACTION.STAND_RIGHT;
    isFalling: boolean = false;
    id: string;
    name: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];
    canvasWidth: number;
    canvasHeight: number;
    moveLeft: boolean;

    constructor(options) {
        this.id = options.id || "0";
        this.name = "Enemy";
        this.sprites = [
          new Sprite({
          context:      options.context, 
          image:        options.images[0], 
          x:            options.x, 
          y:            options.y,
          ticksPerFrame: 60,
          sourceWidth:  options.sourceWidth   || Constants.CHAR_WIDTH,
          sourceHeight: options.sourceHeight  || Constants.CHAR_HEIGHT,
          frameWidth:   options.frameWidth    || Constants.CHAR_WIDTH,
          frameHeight:  options.frameHeight   || Constants.CHAR_HEIGHT }),
          new Sprite({
          context:      options.context, 
          image:        options.images[1], 
          x:            options.x, 
          y:            options.y,
          sourceWidth:  options.sourceWidth,
          sourceHeight: options.sourceHeight,
          frameWidth:   options.frameWidth,
          frameHeight:  options.frameHeight })
        ];
        this.bounds = this.sprites[0];
        this.canvasWidth = options.canvasWidth || 0;
        this.canvasHeight = options.canvasHeight || 0;
        this.moveLeft = options.moveLeft;
    }

    canScrollDown(vert: number = Constants.GRAVITY) {
      return this.canvasHeight <= this.bounds.y + vert ? this.canvasHeight - this.bounds.y : vert; 
    };

    update(options) {
      let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
          scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;
      this.bounds.update(scroll_vert, scroll_horz);
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
  
    toString() {
      if (this.bounds != null) {
        return this.bounds.toString();
      }
      return "";
    };
  }