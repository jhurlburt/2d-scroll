import { Sprite } from './Sprite';
import { BoundingBox } from '../interface/BoundingBox';
import { Constants } from '../helpers/Constants';
import { ACTION } from '../helpers/Character';
import { Helper } from 'src/helpers/Helper';

export class Character implements BoundingBox {
    private sprites: Sprite[];
    private lastAction: ACTION = ACTION.STAND_RIGHT;
    private canvasWidth: number = 0;
    private canvasHeight: number = 0;
    
    id: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];
  
    constructor(options) {
        this.id = options.id || Helper.newGuid();
        // this.name = "Character";  
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
        // this.bounds = this.sprites[ ACTION.STAND_RIGHT ];
        this.canvasWidth = options.canvasWidth || 0;
        this.canvasHeight = options.canvasHeight || 0;
    }

    public canScrollDown(vert: number = Constants.GRAVITY) {
      return this.canvasHeight <= this.sprites[this.lastAction].y + vert ? this.canvasHeight - this.sprites[this.lastAction].y : vert; 
    };

    public canScrollRight (scroll: number = Constants.CHAR_HORZ) {
      return (this.canvasWidth / 2) <= this.sprites[this.lastAction].x + scroll ? (this.canvasWidth / 2) - this.sprites[this.lastAction].x : scroll;
    };
  
    public canScrollLeft (scroll: number = 0 - Constants.CHAR_HORZ) {
      return Constants.CHAR_X_POS >= (this.sprites[this.lastAction].x + scroll) ? Constants.CHAR_X_POS - this.sprites[this.lastAction].x : scroll; //this.boundingBox
    };
  
    public update (options : any) {
      let action: ACTION = ACTION.STAND_RIGHT;

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
      this.sprites.forEach(sprite => {
        sprite.update(options.char_scroll_vert, options.char_scroll_horz);  
      });
    };

    public getBounds() {
      return this.sprites[this.lastAction];
    }

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
  
    public toString () {
      if (this.getBounds() != null) {
        return this.getBounds().toString();
      }
      return "";
    };
} 