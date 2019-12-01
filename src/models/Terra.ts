import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from './Sprite';
import { Helper } from '../helpers/Helper';
import { Block } from './Block';

export class Terra extends Block {

    constructor(options) {
      super(options);
    }

    public update(options) {
      return this.getBounds().update(options.vert, options.scroll);
    }
  }
  