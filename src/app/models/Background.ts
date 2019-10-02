import { Sprite } from '../models/Sprite';
import { Helper } from '../helpers/Helper';
import { Constants } from '../helpers/Constants';

export class Background {
    level1: Sprite;
    isFalling: boolean = false;
    helper: Helper;
    platform_y: number = 0;
    hasCollided: boolean = false;  
    constructor(options) {
      this.level1 = new Sprite({
        context: options.context,
        image: options.images[0],
        x: options.x,
        y: options.y,
        sourceWidth: options.sourceWidth,
        sourceHeight: options.sourceHeight,
        frameWidth: options.frameWidth,
        frameHeight: options.frameHeight,
        numberOfFrames: Math.trunc(options.images[0] / options.frameWidth)
      });
    }
  
    canScrollRight (scroll: number = Constants.CHAR_MOVE) {
      var rightEdge = this.level1.image.width - this.level1.frameWidth;
      return this.level1.sourceX + scroll > rightEdge ? rightEdge - this.level1.sourceX : scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_MOVE) {
      var leftEdge = 0;
      return this.level1.sourceX + scroll < leftEdge ? leftEdge - this.level1.sourceX : scroll;
    };
  
    canScrollUp (vert: number = Constants.CHAR_JUMP,  max: number = Constants.CHAR_MAX_JUMP) {
      var topEdge = this.platform_y - max; //-1, -10, -100, -200
      return this.level1.sourceY + vert < topEdge ? this.level1.sourceY - topEdge : vert; //-201 => 
    };
  
    canScrollDown (vert: number = Constants.CHAR_FALL) {
      var bottomEdge = this.platform_y;
      return this.level1.sourceY + vert > bottomEdge ? this.level1.sourceY - bottomEdge : vert; //-1
    };
  
    setPlatform () {
      this.platform_y = this.level1.sourceY;
    };
  
    clearPlatform () {
      this.platform_y = 0;
    };
  
    update (scroll: number, vert: number) {
      this.level1.sourceX += scroll;
      this.level1.sourceY += vert;
    };
  
    render () {
      this.level1.render();
    };
  }
  