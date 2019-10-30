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
        var char_top = char.boundingBox.y - char.boundingBox.frameHeight,
          char_bot = char.boundingBox.y,
          char_rt = char.boundingBox.x + char.boundingBox.frameWidth,
          char_lt = char.boundingBox.x;
        
        objects.forEach(element => {
          element.resetCollided();
  
          if (!hasCollidedAny){
            var block_top = element.boundingBox.y - element.boundingBox.frameHeight,
              block_bot = element.boundingBox.y,
              block_rt = element.boundingBox.x + element.boundingBox.frameWidth,
              block_lt = element.boundingBox.x;
  
            if (((char_rt + scroll >= block_lt) && (char_lt + scroll <= block_lt))) {
              element.hasCollidedLeft = ((char_bot + vert > block_top) && (char_top + vert < block_bot));
  
            } else if (((char_lt + scroll <= block_rt) && (char_rt + scroll >= block_rt))) {
              element.hasCollidedRight = ((char_bot + vert > block_top) && (char_top + vert < block_bot));
            }
            if (element.hasCollidedLeft || element.hasCollidedRight){

              if (((char_top + vert <= block_bot) && (char_bot + vert > block_bot)) &&
                ((char_rt > block_lt + 5) && (char_lt < block_rt - 5))) {
                element.hasCollidedBottom = true;
                element.hasCollidedLeft = false;
                element.hasCollidedRight = false;

              } else if (((char_bot + vert >= block_top) && (char_top + vert < block_top)) &&
                ((char_rt > block_lt + 5) && (char_lt < block_rt - 5))) {
                element.hasCollidedTop = true;
                element.hasCollidedLeft = false;
                element.hasCollidedRight = false;
              }
            }
            hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) || (element.hasCollidedLeft || element.hasCollidedRight);
            // hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) && (element.hasCollidedLeft || element.hasCollidedRight);
            
          } 
        });
      }
      return hasCollidedAny;
    };
  }