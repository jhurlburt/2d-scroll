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
      var hasCollidedAny = false, 
        hasCollidedX = false, 
        hasCollidedY = false;
      
      if (char != null) {
        var orig_top = char.boundingBox.y - char.boundingBox.frameHeight,
          orig_bot = char.boundingBox.y,
          orig_rt = char.boundingBox.x + char.boundingBox.frameWidth,
          orig_lt = char.boundingBox.x;

        var dest_top = orig_top+v,
          dest_bot = orig_bot+v,
          dest_rt = orig_rt+s,
          dest_lt = orig_lt+s;

        var isCollidedTop = false, willCollideTop = false,
          isCollidedBot = false, willCollideBot = false,
          isCollidedLt = false, willCollideLt = false,
          isCollidedRt = false, willCollideRt = false;
          
        objects.forEach(element => {
          element.resetCollided();
  
          if (!hasCollidedAny){
            var block_top = element.boundingBox.y - element.boundingBox.frameHeight,
              block_bot = element.boundingBox.y,
              block_rt = element.boundingBox.x + element.boundingBox.frameWidth,
              block_lt = element.boundingBox.x;

            if ((orig_top< block_top) && (orig_top< block_bot) && (orig_bot>=block_top) && (orig_bot<=block_bot)) {
              //11:00, 12:00, 01:00 
              if (((orig_lt>=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt<=block_rt)) || ((orig_lt< block_lt) && (orig_lt< block_rt) && (orig_rt> block_lt) && (orig_rt> block_rt))) { 
                isCollidedTop = true;
                console.log("orig collided: 0000"); 
              } else if ((orig_lt>=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt>=block_rt)) { 
                isCollidedTop = true;
                isCollidedRt = true;
                console.log("orig collided: 0100"); 
              } else if ((orig_lt<=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt<=block_rt)) { 
                isCollidedTop = true;
                isCollidedLt = true;
                console.log("orig collided: 1100"); 
              }
            } else if ((orig_top>=block_top) && (orig_top<=block_bot) && (orig_bot>=block_top) && (orig_bot> block_bot)) {
              //05:00, 06:00, 07:00 
              if (((orig_lt>=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) 
              && (orig_rt<=block_rt)) || ((orig_lt< block_lt) && (orig_lt< block_rt) && (orig_rt> block_lt) && (orig_rt> block_rt))) { 
                isCollidedBot = true;
                console.log("orig collided: 0600"); 
              } else if ((orig_lt>=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt>=block_rt)) { 
                isCollidedBot = true;
                isCollidedRt = true;
                console.log("orig collided: 0500"); 
              } else if ((orig_lt<=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt<=block_rt)) { 
                isCollidedBot = true;
                isCollidedLt = true;
                console.log("orig collided: 0700"); 
              }
            } else if (((orig_top>=block_top) && (orig_top<=block_bot) && (orig_bot>=block_top) && (orig_bot<=block_bot)) 
                  || ((orig_top<=block_top) && (orig_top<=block_bot) && (orig_bot>=block_top) && (orig_bot>=block_bot))) {
              //03:00, 09:00
              if ((orig_lt>=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt>=block_rt)) { 
                isCollidedRt = true;
                console.log("orig collided: 0300"); 
              }
              if ((orig_lt<=block_lt) && (orig_lt<=block_rt) && (orig_rt>=block_lt) && (orig_rt<=block_rt)) { 
                isCollidedLt = true;
                console.log("orig collided: 0900"); 
              }
            }
            if ((dest_top< block_top) && (dest_top< block_bot) && (dest_bot>=block_top) && (dest_bot<=block_bot)) {
              //11:00, 12:00, 01:00 
              if (((dest_lt>=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt<=block_rt)) 
              || ((dest_lt< block_lt) && (dest_lt< block_rt) && (dest_rt> block_lt) && (dest_rt> block_rt))) { 
                willCollideTop = true;
                console.log("dest collided: 0000"); 
              } else if ((dest_lt>=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt>=block_rt)) { 
                willCollideTop = true;
                willCollideRt = true;
                console.log("dest collided: 0100"); 
              } else if ((dest_lt<=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt<=block_rt)) { 
                willCollideTop = true;
                willCollideLt = true;
                console.log("dest collided: 1100"); 
              }
            } else if ((dest_top>=block_top) && (dest_top<=block_bot) && (dest_bot>=block_top) && (dest_bot> block_bot)) {
              //05:00, 06:00, 07:00 
              if (((dest_lt>=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt<=block_rt)) 
              || ((dest_lt< block_lt) && (dest_lt< block_rt) && (dest_rt> block_lt) && (dest_rt> block_rt))) { 
                willCollideBot = true;
                console.log("dest collided: 0600"); 
              } else if ((dest_lt>=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt>=block_rt)) { 
                willCollideBot = true;
                willCollideRt = true;
                console.log("dest collided: 0500"); 
              } else if ((dest_lt<=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt<=block_rt)) { 
                willCollideBot = true;
                willCollideLt = true;
                console.log("dest collided: 0700"); 
              }
            } else if (((dest_top>=block_top) && (dest_top<=block_bot) && (dest_bot>=block_top) && (dest_bot<=block_bot)) 
                  || ((dest_top<=block_top) && (dest_top<=block_bot) && (dest_bot>=block_top) && (dest_bot>=block_bot))) {
              //03:00, 09:00 - will work when character is smaller than the block
              //TODO: test then character is larger than the block
              if ((dest_lt>=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt>=block_rt)) { 
                willCollideRt = true;
                console.log("dest collided: 0300"); 
              }
              if ((dest_lt<=block_lt) && (dest_lt<=block_rt) && (dest_rt>=block_lt) && (dest_rt<=block_rt)) { 
                willCollideLt = true;
                console.log("dest collided: 0900"); 
              }
            }
            element.hasCollidedTop    = willCollideTop && !isCollidedTop;
            element.hasCollidedBottom = willCollideBot && !isCollidedBot;
            element.hasCollidedLeft   = willCollideLt && !isCollidedLt;
            element.hasCollidedRight  = willCollideRt && !isCollidedRt;

            hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) || (element.hasCollidedLeft || element.hasCollidedRight);            
          } 
        });
      }
      return hasCollidedAny;
    };
  }