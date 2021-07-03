import { BoundingBox } from '../interface/BoundingBox';
export class Helper {
    static newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };  

    static enemyCollided(char: BoundingBox, element: BoundingBox){
      let orig_top=char.getBounds().y-char.getBounds().frameHeight
      , orig_bot=char.getBounds().y
      , orig_rt=char.getBounds().x+char.getBounds().frameWidth
      , orig_lt=char.getBounds().x;
        
      let block_top = element.getBounds().y - element.getBounds().frameHeight, block_bot = element.getBounds().y
      , block_rt = element.getBounds().x + element.getBounds().frameWidth, block_lt = element.getBounds().x;

      if ((orig_rt>=block_lt) && (orig_lt<=block_lt) && (orig_top< block_bot) && (orig_bot> block_top)){
        char.hasCollidedRight.push( element.id );

      } else if ((orig_lt<=block_rt) && (orig_rt>=block_rt) && (orig_top< block_bot) && (orig_bot> block_top)){
        char.hasCollidedLeft.push( element.id );
      
      } else if ((orig_bot>=block_top) && (orig_top<=block_top) && (orig_rt> block_lt) && (orig_lt< block_rt)){
        char.hasCollidedBottom.push( element.id );
      
      } else if ((orig_top<=block_bot) && (orig_bot>=block_bot) && (orig_rt> block_lt) && (orig_lt< block_rt)){
        char.hasCollidedTop.push( element.id );
      }
      let result : boolean = ((orig_bot>=block_top) && (orig_top<=block_bot)) && ((orig_rt>=block_lt) && (orig_lt<=block_rt));
      return result;
    }
  
    static detectCollisionList(char: BoundingBox, boundObjList: BoundingBox[], canvas_move_y: number = 0, char_move_y: number, canvas_move_x: number = 0, char_move_x: number = 0) {      
      let hasCollided : boolean = false;
      if (char != null) {
        //when detecting collision, use boundObj y instead of canvas y 

        //Character original position (WHERE I AM)
        let char_top_now = char.getBounds().y
        , char_bot_now = char.getBounds().y + char.getBounds().frameHeight
        , char_rt_now = char.getBounds().x + char.getBounds().frameWidth
        , char_lt_now = char.getBounds().x;
          
        //Detect collision using character destination (WHERE I WILL BE)
        let char_top_dest = char_top_now + char_move_y + canvas_move_y
        , char_bot_dest = char_bot_now + char_move_y + canvas_move_y
        , char_rt_dest = char_rt_now + char_move_x + canvas_move_x
        , char_lt_dest = char_lt_now + char_move_x + canvas_move_x;

        boundObjList.forEach(boundObj => {  
          let boundObj_top = boundObj.getBounds().y
          , boundObj_bot = boundObj.getBounds().y + boundObj.getBounds().frameHeight 
          , boundObj_rt = boundObj.getBounds().x + boundObj.getBounds().frameWidth
          , boundObj_lt = boundObj.getBounds().x;

          if ((char_rt_dest +1 >= boundObj_lt) && (char_lt_dest <= boundObj_lt) && (char_top_now < boundObj_bot) && (char_bot_now > boundObj_top)){
            char.hasCollidedRight.push( boundObj.id );
            boundObj.hasCollidedLeft.push( char.id );
            boundObj.collisionObjectId.push( char.id );

          } else if ((char_rt_dest >= boundObj_rt) && (char_lt_dest -1 <= boundObj_rt) && (char_top_now < boundObj_bot) && (char_bot_now > boundObj_top)){
            char.hasCollidedLeft.push( boundObj.id );
            boundObj.hasCollidedRight.push( char.id );
            boundObj.collisionObjectId.push( char.id );

          } else if ((char_top_dest <= boundObj_top) && (char_bot_dest -1 >= boundObj_top) && (char_rt_now > boundObj_lt) && (char_lt_now < boundObj_rt)){
            char.hasCollidedBottom.push( boundObj.id );
            boundObj.hasCollidedTop.push( char.id );
            boundObj.collisionObjectId.push( char.id );

          } else if ((char_top_dest +1 <= boundObj_bot) && (char_bot_dest >= boundObj_bot) && (char_rt_now > boundObj_lt) && (char_lt_now < boundObj_rt)){
            char.hasCollidedTop.push( boundObj.id );
            boundObj.hasCollidedBottom.push( char.id );
            boundObj.collisionObjectId.push( char.id );

          }
          hasCollided = boundObj.collisionObjectId.includes( char.id ) ? true : hasCollided;
        });
      }
      return hasCollided;
    };
  }