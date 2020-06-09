import { Block } from './Block';

export class StandPipe extends Block {

  constructor(options) {
    super(options);
  }
  
  public update (options) {
    return this.getBounds().update(options.vert, options.scroll);
  };
}
  