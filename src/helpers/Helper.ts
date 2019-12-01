import { BoundingBox } from '../interface/BoundingBox';
import { Sprite } from '../models/Sprite';
import { element } from '@angular/core/src/render3';
import { Enemy } from 'src/models/Enemy';
import { StandPipe } from 'src/models/StandPipe';
import { Character } from 'src/models/Character';

export class Helper {
    static newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };  
  
    collideWithBox(char: BoundingBox, objects: BoundingBox[], bg_v1: number = 0, ch_v2: number, bg_s1: number = 0, ch_s2: number = 0) {      
      if (char != null) {

        //Character original position (WHERE I AM)
        let orig_top=char.getBounds().y-char.getBounds().frameHeight, orig_bot=char.getBounds().y
        , orig_rt=char.getBounds().x+char.getBounds().frameWidth, orig_lt=char.getBounds().x;
          
        //Detect collision using ch_v2 and ch_s2 (WHERE I WILL BE)
        let dest_top=orig_top + ch_v2 + bg_v1
        , dest_bot=orig_bot + ch_v2 + bg_v1
        , dest_rt=orig_rt + ch_s2 + bg_s1
        , dest_lt=orig_lt + ch_s2 + bg_s1;

        // if ((char instanceof Character) || (char instanceof Enemy)) {
        //   dest_top += bg_v1;
        //   dest_bot += bg_v1;
        //   dest_rt += bg_s1;
        //   dest_lt += bg_s1;
        // }

        objects.forEach(element => {  
          let block_top = element.getBounds().y - element.getBounds().frameHeight, block_bot = element.getBounds().y,
              block_rt = element.getBounds().x + element.getBounds().frameWidth, block_lt = element.getBounds().x;
          // let isCollided = ((orig_bot>=block_top) && (orig_top<=block_bot)) && ((orig_rt>=block_lt) && (orig_lt<=block_rt));
          let isCollided = false;

          if (!isCollided){
            if ((dest_rt>=block_lt) && (dest_lt<=block_lt) && (orig_top< block_bot) && (orig_bot> block_top)){
              element.hasCollidedLeft.push( char.id );
              element.collisionObjectId.push( char.id );

              char.hasCollidedRight.push( element.id );
              char.collisionObjectId.push( element.id );

            } else if ((dest_lt<=block_rt) && (dest_rt>=block_rt) && (orig_top< block_bot) && (orig_bot> block_top)){
              element.hasCollidedRight.push( char.id );
              element.collisionObjectId.push( char.id );

              char.hasCollidedLeft.push( element.id );
              char.collisionObjectId.push( element.id );

            } else if ((dest_bot>=block_top) && (dest_top<=block_top) && (orig_rt> block_lt) && (orig_lt< block_rt)){
              element.hasCollidedTop.push( char.id );
              element.collisionObjectId.push( char.id );

              char.hasCollidedBottom.push( element.id );
              char.collisionObjectId.push( element.id );

            } else if ((dest_top<=block_bot) && (dest_bot>=block_bot) && (orig_rt> block_lt) && (orig_lt< block_rt)){
              element.hasCollidedBottom.push( char.id );
              element.collisionObjectId.push( char.id );

              char.hasCollidedTop.push( element.id );
              char.collisionObjectId.push( element.id );

            }
          }
        });
        return char.collisionObjectId.length > 0;
      }
      return false;
    };
  }