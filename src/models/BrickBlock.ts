import { Block } from './Block';
import { Output, EventEmitter } from '@angular/core';

export class BrickBlock extends Block {

  constructor(options) {
    super(options);
  }

  public update (options) {    
    // if (this.hasCollided() && this.hasCollidedBottom.length > 0) {
      //BB TODO 1. Animate brick smashing

      //BB TODO 2. Notify subscribers
      // this.notifyParent.emit({ name: "Collision" })
      
      //BB TODO 3. Parent, remove brick from array
    // }
    return this.getBounds().update(options.vert, options.scroll);
  };
}
  