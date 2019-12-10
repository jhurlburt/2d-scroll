import { Block } from './Block';

export class Terra extends Block {

  constructor(options) {
    super(options);
  }

  public update(options) {
    return this.getBounds().update(options.vert, options.scroll);
  }
}
  