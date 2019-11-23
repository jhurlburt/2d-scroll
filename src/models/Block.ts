import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
import { Constants } from '../helpers/Constants';

export class Block implements BoundingBox {
    bounds: Sprite;
    id: string;
    name: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];
    step: number = 0;
    offset: number = 0;
    images: HTMLImageElement[];
    canUpdate: boolean = true;
  
    constructor(options) {
      this.id = options.id || "0";
      this.name = options.name || "Block";
      this.images = options.images;
      this.bounds = new Sprite({
        context:        options.context,
        image:          options.images[0],
        x:              options.x,
        y:              options.y || Constants.PLATFORM_1_Y,
        ticksPerFrame:  options.ticksPerFrame || Constants.BLOCK_TPF,
        sourceWidth:    options.sourceWidth || Constants.BLOCK_WIDTH,
        sourceHeight:   options.sourceHeight || Constants.BLOCK_HEIGHT,
        frameWidth:     options.frameWidth || Constants.BLOCK_WIDTH,
        frameHeight:    options.frameHeight || Constants.BLOCK_HEIGHT
      });
    }
  
    update (options) {
      //TODO: Animate
      if ((this.name == "Question") && (this.hasCollided() && this.hasCollidedBottom.length > 0)) {
        //Block types: coin, mushroom
        //     If type is coin then animate coin, add to score
        //     If type is mushroom then add mushroom to scene
        this.bounds.stopUpdate();
        this.bounds.image = this.images[1];
        console.log(this.name);

      } else if ((this.name == "Brick") && (this.hasCollided() && this.hasCollidedBottom.length > 0)) {
        console.log(this.name);
      }
      this.bounds.update(options.vert, options.scroll);
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
  
    toString () {
      let result = (this.bounds != null) ? this.bounds.toString() : "";      
      result = result + ", hasCollidedLeft: " + this.hasCollidedLeft +
        ", hasCollidedRight: " + this.hasCollidedRight +
        ", hasCollidedTop: " + this.hasCollidedTop +
        ", hasCollidedBottom: " + this.hasCollidedBottom;
      return result;
    };
  }
  