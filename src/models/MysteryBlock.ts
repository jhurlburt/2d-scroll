// import { BoundingBox } from '../interface/BoundingBox';
// import { Sprite } from './Sprite';
// import { Constants } from '../helpers/Constants';
import { Block } from './Block';

export class MysteryBlock extends Block {

  constructor(options) {
    super(options);
  }

  public update (options) {
    
    if (this.hasCollided() && this.hasCollidedBottom.length > 0) {
      //Block types: coin, mushroom
      //     If type is coin then animate coin, add to score
      //     If type is mushroom then add mushroom to scene
      this.getBounds().stopUpdate();
      this.getBounds().image = this.images[1];
    }
    return this.getBounds().update(options.vert, options.scroll);
  };
}
  