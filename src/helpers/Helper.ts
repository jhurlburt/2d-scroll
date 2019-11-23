import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
import { element } from '@angular/core/src/render3';

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
        let orig_top=char.bounds.y-char.bounds.frameHeight, orig_bot=char.bounds.y
          , orig_rt=char.bounds.x+char.bounds.frameWidth, orig_lt=char.bounds.x;
        let dest_top=orig_top+v, dest_bot=orig_bot+v
          , dest_rt=orig_rt+s, dest_lt=orig_lt+s;

        objects.forEach(element => {  
          if (!hasCollidedAny){  
            let block_top = element.bounds.y - element.bounds.frameHeight, block_bot = element.bounds.y,
                block_rt = element.bounds.x + element.bounds.frameWidth, block_lt = element.bounds.x;
            let isCollided = ((orig_bot>=block_top) && (orig_top<=block_bot)) && ((orig_rt>=block_lt) && (orig_lt<=block_rt));

            if (!isCollided){
              if ((dest_rt>=block_lt) && (dest_lt<=block_lt) && (orig_top< block_bot) && (orig_bot> block_top)){
                element.hasCollidedLeft.push( char.id );
                char.hasCollidedRight.push( element.id );
                hasCollidedAny = true;
                // console.log("orig collided: left");
              } else if ((dest_lt<=block_rt) && (dest_rt>=block_rt) && (orig_top< block_bot) && (orig_bot> block_top)){
                element.hasCollidedRight.push( char.id );
                char.hasCollidedLeft.push( element.id );
                hasCollidedAny = true;
                // console.log("orig collided: right");
              } else if ((dest_bot>=block_top) && (dest_top<=block_top) && (orig_rt> block_lt) && (orig_lt< block_rt)){
                element.hasCollidedTop.push( char.id );
                char.hasCollidedBottom.push( element.id );
                hasCollidedAny = true;
                // console.log("orig collided: top");
              } else if ((dest_top<=block_bot) && (dest_bot>=block_bot) && (orig_rt> block_lt) && (orig_lt< block_rt)){
                element.hasCollidedBottom.push( char.id );
                char.hasCollidedTop.push( element.id );
                hasCollidedAny = true;
                // console.log("orig collided: bottom");
              }
              if (hasCollidedAny){
                char.collisionObjectId.push( element.id );
                element.collisionObjectId.push( char.id );
              }
            }
          } 
        });
      }
      return hasCollidedAny;
    };
  }