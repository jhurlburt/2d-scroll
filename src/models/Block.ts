import { BoundingBox } from '../interface/BoundingBox';
import { Helper } from '../helpers/Helper';
import { Sprite } from '../models/Sprite';
import { Constants } from '../helpers/Constants';

export class Block implements BoundingBox {
    boundingBox: Sprite;
    platform_y: number;
    id: string;
    name: string;
    hasCollidedTop: boolean = false;
    hasCollidedBottom: boolean = false;
    hasCollidedLeft: boolean = false;
    hasCollidedRight: boolean = false;
    collisionObjectName: string = "";
    collisionObjectId: number = 0;
    step: number = 0;
    offset: number = 0;
    images: HTMLImageElement[];
    canUpdate: boolean = true;
  
    constructor(options) {
        this.id = options.id || "0";
        this.name = options.name || "Block";
        this.images = options.images;
        this.boundingBox = new Sprite({
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
  
    toString () {
      var result = "";
      if (this.boundingBox != null) {
        result = this.boundingBox.toString();      
      }    
      result = result + ", hasCollidedLeft: " + this.hasCollidedLeft +
        ", hasCollidedRight: " + this.hasCollidedRight +
        ", hasCollidedTop: " + this.hasCollidedTop +
        ", hasCollidedBottom: " + this.hasCollidedBottom;
      return result;
    };
  
    update (options) {
      if ((this.name == "Question") && (this.hasCollided() && this.hasCollidedBottom)) {
        // console.log(this.toString());
        this.boundingBox.stopUpdate();
        this.boundingBox.image = this.images[1];
  
        //TODO: Animate
        //Block types: coin, mushroom
        //If type is coin then animate coin, add to score
        //If type is mushroom then add mushroom to scene
      }
      this.platform_y = options.platform_y;
      this.boundingBox.update(options.vert, options.scroll);
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
  