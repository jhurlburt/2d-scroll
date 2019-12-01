import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from './Sprite';
import { Constants } from '../helpers/Constants';
import { Block } from './Block';

export class BrickBlock extends Block {

  constructor(options) {
    super(options);
  }

  public update (options) {    
    return this.getBounds().update(options.vert, options.scroll);
  };
}
  