import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
import { Constants } from '../helpers/Constants';
import { Helper } from 'src/helpers/Helper';
import { Output, EventEmitter } from '@angular/core';

export abstract class Block implements BoundingBox {
  protected lastAction: number = 0;  
  protected bounds: Sprite[];
  protected step: number = 0;
  protected offset: number = 0;
  protected images: HTMLImageElement[];
  protected canUpdate: boolean = true;
  hasCollidedTop: string[];
  hasCollidedBottom: string[];
  hasCollidedLeft: string[];
  hasCollidedRight: string[];
  collisionObjectId: string[];
  id: string;
  isTerminated: boolean;

  // @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(options) {
    this.id = options.id || Helper.newGuid();
    this.images = options.images;
    this.bounds = [ 
      new Sprite({ 
        context: options.context, image: options.images[0]
        , x: options.x, y: options.y           || Constants.PLATFORM_1_Y
        , ticksPerFrame: options.ticksPerFrame || Constants.BLOCK_TPF
        , sourceWidth:   options.sourceWidth   || Constants.BLOCK_WIDTH
        , sourceHeight:  options.sourceHeight  || Constants.BLOCK_HEIGHT
        , frameWidth:    options.frameWidth    || Constants.BLOCK_WIDTH
        , frameHeight:   options.frameHeight   || Constants.BLOCK_HEIGHT
      })
    ];
  }

  abstract update (options) : void;

  public getBounds() {
    if (this.bounds[this.lastAction] != null){
      return this.bounds[this.lastAction];
    }
  }
  
  public render () {
    this.getBounds().render();
  };

  public hasCollided () {
    return this.collisionObjectId != null && this.collisionObjectId.length > 0;
  };
  
  public resetCollided () {
    this.hasCollidedBottom = [];
    this.hasCollidedTop = [];
    this.hasCollidedLeft = [];
    this.hasCollidedRight = [];
    this.collisionObjectId = [];
  };
  
  public toString () {
    let result : string = (this.getBounds() != null) ? this.getBounds().toString() : "";      
    result += ", hasCollidedLeft: " + this.hasCollidedLeft.toString() +
      ", hasCollidedRight: " + this.hasCollidedRight.toString() +
      ", hasCollidedTop: " + this.hasCollidedTop.toString() +
      ", hasCollidedBottom: " + this.hasCollidedBottom.toString();
    return result;
  };
}
  