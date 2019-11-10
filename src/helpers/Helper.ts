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
      let hasCollidedAny = false, 
        hasCollidedX = false, 
        hasCollidedY = false;
      
      if (char != null) {
        let orig_top = char.boundingBox.y - char.boundingBox.frameHeight,
          orig_bot = char.boundingBox.y,
          orig_rt = char.boundingBox.x + char.boundingBox.frameWidth,
          orig_lt = char.boundingBox.x;

        let dest_top = orig_top+v,
          dest_bot = orig_bot+v,
          dest_rt = orig_rt+s,
          dest_lt = orig_lt+s;

        let isCollidedTop = false, willCollideTop = false,
          isCollidedBot = false, willCollideBot = false,
          isCollidedLt = false, willCollideLt = false,
          isCollidedRt = false, willCollideRt = false,
          isCollided = false;
          
        objects.forEach(element => {
          element.resetCollided();
  
          if (!hasCollidedAny){
            let block_top = element.boundingBox.y - element.boundingBox.frameHeight,
              block_bot = element.boundingBox.y,
              block_rt = element.boundingBox.x + element.boundingBox.frameWidth,
              block_lt = element.boundingBox.x;

            isCollided = ((orig_bot>=block_top) && (orig_bot<=block_bot)) ||
              ((orig_top<=block_bot) && (orig_top>=block_top)) ||
              ((orig_rt>=block_lt) && (orig_rt<=block_rt)) ||
              ((orig_lt<=block_rt) && (orig_lt>=block_lt));
            
            isCollidedTop = (orig_bot>=block_top) && (orig_top<=block_top) && ((orig_rt>=block_lt) || (orig_lt<=block_rt));
            isCollidedBot = (orig_top<=block_bot) && (orig_bot>=block_bot) && ((orig_rt>=block_lt) || (orig_lt<=block_rt));
            isCollidedRt = (orig_lt<=block_rt) && (orig_rt>=block_rt);
            isCollidedLt = (orig_rt>=block_lt) && (orig_lt<=block_lt);

            willCollideTop = (dest_bot>=block_top) && (dest_bot<=block_top) && (dest_rt>=block_lt) && (dest_lt<=block_rt);
            willCollideBot = (dest_top<=block_bot) && (dest_bot>=block_bot) && (dest_rt>=block_lt) && (dest_lt<=block_rt);
            willCollideRt = (dest_lt<=block_rt) && (dest_rt>=block_rt) && (dest_top<=block_bot) && (dest_bot>=block_top);
            willCollideLt = (dest_rt>=block_lt) && (dest_lt<=block_lt) && (dest_top<=block_bot) && (dest_bot>=block_top);
            
            element.hasCollidedTop    = !isCollidedTop && willCollideTop;
            element.hasCollidedBottom = !isCollidedBot && willCollideBot;
            element.hasCollidedLeft   = !isCollidedLt && willCollideLt;
            element.hasCollidedRight  = !isCollidedRt && willCollideRt;

            hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) || (element.hasCollidedLeft || element.hasCollidedRight);            

            //   if ((orig_top< block_top) && (orig_top< block_bot) && (orig_bot>=block_top) && (orig_bot<=block_bot)) {
            //   isCollidedTop = true;
            //   console.log("orig collided: 1200"); 
            // } 
            // if ((orig_top>=block_top) && (orig_top<=block_bot) && (orig_bot>=block_top) && (orig_bot> block_bot)) {
            //   isCollidedBot = true;
            //   console.log("orig collided: 0600"); 
            // }
            // if ((orig_lt>=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt>=block_rt)) { 
            //   isCollidedRt = true;
            //   console.log("orig collided: 0300"); 
            // }
            // if ((orig_lt<=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt<=block_rt)) { 
            //   isCollidedLt = true;
            //   console.log("orig collided: 0900"); 
            // }

            // if ((dest_top< block_top) && (dest_top< block_bot) && (dest_bot>=block_top) && (dest_bot<=block_bot)) {
            //   willCollideTop = true;
            //   console.log("dest collided: 0000"); 
            // }
            // if ((dest_top>=block_top) && (dest_top<=block_bot) && (dest_bot>=block_top) && (dest_bot> block_bot)) {
            //   willCollideBot = true;
            //   console.log("dest collided: 0600"); 
            // }
            // if ((dest_lt>=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt>=block_rt)) { 
            //   willCollideRt = true;
            //   console.log("dest collided: 0300");
            // }
            // if ((dest_lt<=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt<=block_rt)) { 
            //   willCollideLt = true;
            //   console.log("dest collided: 0900"); 
            // }
          } 
        });
      }
      return hasCollidedAny;
    };
  }