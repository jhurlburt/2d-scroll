import { Block } from './Block';
import { Output, EventEmitter } from '@angular/core';
import { Sprite } from './Sprite';
import { Constants } from 'src/helpers/Constants';

//0,=bg //1,=shirt //2,=hair/shoes //3,=skin //4,=button //5,=eyes/mustache //6,=pants
const colorPallette = [
  '#FFFFFF',  //0,=bg
  '#ff6f13',  //1,=brick
  '#FFFFFF',  //2,=not used
  '#FFFFFF',  //3,=not used
  '#FFFFFF',  //4,=not used
  '#000000',  //5,=eyes/mustache (dk gray)
  '#FFFFFF']; //6,=not used

const block = [
  [1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5],
  [1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5],
  [1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5],
  [1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5],
  [1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]];

export class BrickBlock extends Block {

  constructor(options) {
    super({
      sprites: [
        new Sprite({ 
          context: options.context, 
          dataMaps: [ block ], 
          x: options.x, 
          y: options.y || Block.PLATFORM_1_Y, 
          colorPallette: colorPallette })
      ]
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
  