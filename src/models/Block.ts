import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
import { Helper } from 'src/helpers/Helper';

export abstract class Block implements BoundingBox {
  protected lastAction: number = 0;
  protected bounds: Sprite[];
  protected step: number = 0;
  protected offset: number = 0;
  protected canUpdate: boolean = true;
  public hasCollidedTop: string[];
  public hasCollidedBottom: string[];
  public hasCollidedLeft: string[];
  public hasCollidedRight: string[];
  public collisionObjectId: string[];
  public id: string;
  public isTerminated: boolean;

  static readonly PLATFORM_1_Y: number = 484;
  static readonly PLATFORM_2_Y: number = Block.PLATFORM_1_Y  - 228;
  // static readonly CHAR_JUMP: number = -1;
  static readonly TPF: number = 30;
  static readonly WIDTH: number = 64;
  static readonly HEIGHT: number = 64;
  
  constructor(options) {
    this.id = options.id || Helper.newGuid(); 
    this.bounds = options.sprites;    
  }

  abstract update (options) : void;

  public getBounds() {
    if (this.bounds[this.lastAction] != null){
      return this.bounds[this.lastAction];
    }
  }
  
  public render ( sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number ) {
    this.getBounds().render( sourceX, sourceY, sourceWidth, sourceHeight );
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
  