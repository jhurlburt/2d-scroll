import { Block } from './Block';
import { Sprite } from './Sprite';

export abstract class Pipe extends Block {

  constructor(options) {
    super({
      sprites: [
        new Sprite({ 
          context: options.context, 
          dataMaps: [ options.dataMap ], 
          x: options.x, 
          y: options.y, 
          colorPallette: options.colorPallette })] //, frameWidth: 128, frameHeight: 152
    });
  }

  public update (options) {    
    if (this.hasCollided() && this.hasCollidedBottom.length > 0) {
      //BB TODO 1. Animate brick smashing

      //BB TODO 2. Notify subscribers
      // this.notifyParent.emit({ name: "Collision" })
      
      //BB TODO 3. Parent, remove brick from array
    }
    this.bounds.forEach(sprite => { sprite.update(options.vert, options.scroll);   });
  };
}
  