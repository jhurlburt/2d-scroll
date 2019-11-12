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
  
    static collideWithBox(char: BoundingBox, objects: BoundingBox[], v: number = 0, s: number = 0) {
      let hasCollidedAny = false;
      
      if (char != null) {
        let orig_top=char.boundingBox.y-char.boundingBox.frameHeight, orig_bot=char.boundingBox.y, orig_rt=char.boundingBox.x+char.boundingBox.frameWidth, orig_lt=char.boundingBox.x;
        let dest_top=orig_top+v, dest_bot=orig_bot+v, dest_rt=orig_rt+s, dest_lt=orig_lt+s;

        objects.forEach(element => {
          element.resetCollided();
  
          if (!hasCollidedAny){  
            let block_top = element.boundingBox.y - element.boundingBox.frameHeight, block_bot = element.boundingBox.y,
            block_rt = element.boundingBox.x + element.boundingBox.frameWidth, block_lt = element.boundingBox.x;
            let isCollided = ((orig_bot>=block_top) && (orig_top<=block_bot)) && ((orig_rt>=block_lt) && (orig_lt<=block_rt));

            if (!isCollided){
              if ((dest_rt>=block_lt) && (dest_lt<=block_lt) && (orig_top< block_bot) && (orig_bot> block_top)){
                element.hasCollidedLeft = true;
                console.log("orig collided: left");
              } else if ((dest_lt<=block_rt) && (dest_rt>=block_rt) && (orig_top< block_bot) && (orig_bot> block_top)){
                element.hasCollidedRight = true;
                console.log("orig collided: right");
              } else if ((dest_bot>=block_top) && (dest_top<=block_top) && (orig_rt> block_lt) && (orig_lt< block_rt)){
                element.hasCollidedTop = true;
                console.log("orig collided: top");
              } else if ((dest_top<=block_bot) && (dest_bot>=block_bot) && (orig_rt> block_lt) && (orig_lt< block_rt)){
                element.hasCollidedBottom = true;
                console.log("orig collided: bottom");
              }
              hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) || (element.hasCollidedLeft || element.hasCollidedRight);
            }
          } 
        });
      }
      return hasCollidedAny;
    };
  }