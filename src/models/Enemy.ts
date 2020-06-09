import { Sprite } from '../models/Sprite';
import { Block } from './Block';

export class Enemy extends Block {
  moveLeft: boolean;

  constructor(options) {
    super(options);

    this.bounds.push(
      new Sprite({ context: options.context, image: options.images[1], x: options.x, y: options.y
        , sourceWidth: options.sourceWidth, sourceHeight: options.sourceHeight
        , frameWidth: options.frameWidth, frameHeight:  options.frameHeight 
      })
    );
    this.moveLeft = options.moveLeft;
  }
  
  public update(options) {
    let scroll_vert : number = options.bg_scroll_vert + options.char_scroll_vert,
        scroll_horz : number = options.bg_scroll_horz + options.char_scroll_horz;

    // if (this.collisionObjectId.length > 0){
    // }  
    if (this.isTerminated){
      console.log("Hey, dog. This aint for me, neither!")
    }
    this.bounds.forEach(sprite => {
      sprite.update(scroll_vert, scroll_horz);  
    });
  };
}