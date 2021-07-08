import { Constants } from 'src/helpers/Constants';
import { Block } from './Block';
import { Sprite } from './Sprite';

const colorPallette = [
  '#FFFFFF',     //0,=bg
  '#182a99',  //1,=
  '#ff6f13',  //2,=text
  '#ffa442',  //3,=bg
  '#dbde31',  //4,=button (yellow)
  '#000000',  //5=shadow2
  '#FFFFFF']; //6,=not used

const block1 = [
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5],
  [2,3,5,3,3,3,3,3,3,3,3,3,3,5,3,5],
  [2,3,3,3,3,2,2,2,2,2,3,3,3,3,3,5],
  [2,3,3,3,2,2,5,5,5,2,2,3,3,3,3,5],
  [2,3,3,3,2,2,5,3,3,2,2,5,3,3,3,5],
  [2,3,3,3,2,2,5,3,3,2,2,5,3,3,3,5],
  [2,3,3,3,3,5,5,3,2,2,2,5,3,3,3,5],
  [2,3,3,3,3,3,3,2,2,5,5,5,3,3,3,5],
  [2,3,3,3,3,3,3,2,2,5,3,3,3,3,3,5],
  [2,3,3,3,3,3,3,3,5,5,3,3,3,3,3,5],
  [2,3,3,3,3,3,3,2,2,3,3,3,3,3,3,5],
  [2,3,3,3,3,3,3,2,2,5,3,3,3,3,3,5],
  [2,3,5,3,3,3,3,3,5,5,3,3,3,5,3,5],
  [2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]]; 

const block2 = [
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
  [2,2,5,2,2,2,2,2,2,2,2,2,2,5,2,5],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
  [2,2,2,2,2,2,5,5,5,2,2,2,2,2,2,5],
  [2,2,2,2,2,2,5,2,2,2,2,5,2,2,2,5],
  [2,2,2,2,2,2,5,2,2,2,2,5,2,2,2,5],
  [2,2,2,2,2,5,5,2,2,2,2,5,2,2,2,5],
  [2,2,2,2,2,2,2,2,2,5,5,5,2,2,2,5],
  [2,2,2,2,2,2,2,2,2,5,2,2,2,2,2,5],
  [2,2,2,2,2,2,2,2,5,5,2,2,2,2,2,5],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
  [2,2,2,2,2,2,2,2,2,5,2,2,2,2,2,5],
  [2,2,5,2,2,2,2,2,5,5,2,2,2,5,2,5],  
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]];

const TPF: number = 100;
  
export class MysteryBlock extends Block {
  
  constructor(options) {
    super({
      x: options.x,
      y: options.y,
      sprites: [
        new Sprite({ 
          context: options.context, 
          ticksPerFrame: TPF,
          dataMaps: [ block1, block2 ], 
          x: options.x, 
          y: options.y || Block.PLATFORM_1_Y, 
          colorPallette: colorPallette })] //WALK LEFT
    });
  }

  public update (options) {
      //Block types: coin, mushroom
      //     If type is coin then animate coin, add to score
      //     If type is mushroom then add mushroom to scene
    if (this.hasCollided() && this.hasCollidedBottom.length > 0) {
      this.getBounds().stopUpdate();
      // this.getBounds().image = this.images[1];
    }
    this.bounds.forEach(sprite => { sprite.update(options.vert, options.scroll);   });
  };
}
  