import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';

export class Helper {
    static newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };  
  
    static collideWithBox(char: BoundingBox, objects: BoundingBox[], vert: number = 0, scroll: number = 0) {
      var hasCollidedAny = false;
      
      if (char != null) {
        var obj1: Sprite = char.boundingBox,
          char_top = obj1.y - obj1.frameHeight,
          char_bot = obj1.y,
          char_rt = obj1.x + obj1.frameWidth,
          char_lt = obj1.x;
        
        objects.forEach(element => {
          element.resetCollided();
  
          if (!hasCollidedAny){
            var obj2: Sprite = element.boundingBox,
              block_top = obj2.y - obj2.frameHeight,
              block_bot = obj2.y,
              block_rt = obj2.x + obj2.frameWidth,
              block_lt = obj2.x;
  
            if (((char_rt + scroll > block_lt) && (char_lt + scroll < block_rt))) {
              element.hasCollidedLeft = true;
  
            } else if (((char_lt + scroll < block_rt) && (char_rt + scroll > block_lt))) {
              element.hasCollidedRight = true;        
            }
            if ((char_top + vert < block_bot) && (char_bot + vert > block_bot)) {
              element.hasCollidedBottom = element.hasCollidedLeft || element.hasCollidedRight;
  
            } else if ((char_bot + vert > block_top) && (char_bot + vert < block_bot)) {
              element.hasCollidedTop = element.hasCollidedLeft || element.hasCollidedRight;
            }
            hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) && (element.hasCollidedLeft || element.hasCollidedRight);
            
          } 
        });
      }
      return hasCollidedAny;
    };
  }