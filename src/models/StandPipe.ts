import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from './Sprite';
import { Helper } from '../helpers/Helper';
import { Block } from './Block';

export class StandPipe extends Block {

  constructor(options) {
    super(options);
  }
  
  public update (options) {
    this.getBounds().update(options.vert, options.scroll);
  };
}
  