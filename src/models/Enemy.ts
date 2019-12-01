import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
// import { ACTION } from '../models/Character';
import { Constants } from '../helpers/Constants';
import { last } from '@angular/router/src/utils/collection';
import { Helper } from 'src/helpers/Helper';

export class Enemy implements BoundingBox {
    private sprites: Sprite[];
    private lastAction: number = 0;
    id: string;
    moveLeft: boolean;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];

    constructor(options) {
        this.id = options.id || Helper.newGuid();
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
        this.moveLeft = options.moveLeft;
    }

    // canScrollDown(vert: number = Constants.GRAVITY) {
    //   return this.canvasHeight <= this.bounds.y + vert ? this.canvasHeight - this.bounds.y : vert; 
    // };

    public getBounds() {
      if (this.sprites[this.lastAction] != null) {
        return this.sprites[this.lastAction];
      }
    }
    
    public update(options) {
      let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
          scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;

      this.sprites.forEach(sprite => {
        sprite.update(scroll_vert, scroll_horz);  
      });
    };

    public render () {
      this.getBounds().render();
    };

    public resetCollided () {
      this.hasCollidedBottom = [];
      this.hasCollidedTop = [];
      this.hasCollidedLeft = [];
      this.hasCollidedRight = [];
      this.collisionObjectId = [];
    };
  
    public toString() {
      if (this.getBounds() != null) {
        return this.getBounds().toString();
      }
      return "";
    };
  }