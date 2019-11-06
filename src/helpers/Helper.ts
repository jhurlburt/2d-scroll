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
        var ctop = char.boundingBox.y - char.boundingBox.frameHeight + v,
          cbot = char.boundingBox.y + v,
          crt = char.boundingBox.x + char.boundingBox.frameWidth + s,
          clt = char.boundingBox.x + s;
        
        objects.forEach(element => {
          element.resetCollided();
  
          if (!hasCollidedAny){
            var btop = element.boundingBox.y - element.boundingBox.frameHeight,
              bbot = element.boundingBox.y,
              brt = element.boundingBox.x + element.boundingBox.frameWidth,
              blt = element.boundingBox.x;

              // //11:00, 12:00, 01:00 
              // if ((ctop< btop) && (ctop< bbot) && (cbot>=btop) && (cbot<=bbot) && (clt>=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { console.log("collided: 0000-a"); }
              // if ((ctop< btop) && (ctop< bbot) && (cbot>=btop) && (cbot<=bbot) && (clt< blt) && (clt< brt) && (crt> blt) && (crt> brt)) { console.log("collided: 0000-b"); }
              // if ((ctop< btop) && (ctop< bbot) && (cbot>=btop) && (cbot<=bbot) && (clt>=blt) && (clt<=brt) && (crt>=blt) && (crt>=brt)) { console.log("collided: 0100"); }
              // if ((ctop< btop) && (ctop< bbot) && (cbot>=btop) && (cbot<=bbot) && (clt<=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { console.log("collided: 1100"); }

              // //05:00, 06:00, 07:00 
              // if ((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot> bbot) && (clt>=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { console.log("collided: 0600-a"); }
              // if ((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot> bbot) && (clt< blt) && (clt< brt) && (crt> blt) && (crt> brt)) { console.log("collided: 0600-b"); }
              // if ((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot> bbot) && (clt>=blt) && (clt<=brt) && (crt>=blt) && (crt>=brt)) { console.log("collided: 0500"); }
              // if ((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot> bbot) && (clt<=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { console.log("collided: 0700"); }

              // //03:00, 09:00 - will work when character is smaller than the block
              // if ((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot<=bbot) && (clt>=blt) && (clt<=brt) && (crt>=blt) && (crt>=brt)) { console.log("collided: 0300"); }
              // if ((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot<=bbot) && (clt<=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { console.log("collided: 0900"); }

            if ((ctop< btop) && (ctop< bbot) && (cbot>=btop) && (cbot<=bbot)) {
              //11:00, 12:00, 01:00 
              if (((clt>=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) || ((clt< blt) && (clt< brt) && (crt> blt) && (crt> brt))) { 
                element.hasCollidedTop = true;
                console.log("collided: 0000"); 
              } else if ((clt>=blt) && (clt<=brt) && (crt>=blt) && (crt>=brt)) { 
                element.hasCollidedTop = true;
                element.hasCollidedRight = true;
                console.log("collided: 0100"); 
              } else if ((clt<=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { 
                element.hasCollidedTop = true;
                element.hasCollidedLeft = true;
                console.log("collided: 1100"); 
              }
            } else if ((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot> bbot)) {
              //05:00, 06:00, 07:00 
              if (((clt>=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) || ((clt< blt) && (clt< brt) && (crt> blt) && (crt> brt))) { 
                element.hasCollidedBottom = true;
                console.log("collided: 0600"); 
              } else if ((clt>=blt) && (clt<=brt) && (crt>=blt) && (crt>=brt)) { 
                element.hasCollidedBottom = true;
                element.hasCollidedRight = true;
                console.log("collided: 0500"); 
              } else if ((clt<=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { 
                element.hasCollidedBottom = true;
                element.hasCollidedLeft = true;
                console.log("collided: 0700"); 
              }
            } else if (((ctop>=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot<=bbot)) || ((ctop<=btop) && (ctop<=bbot) && (cbot>=btop) && (cbot>=bbot))) {
              //03:00, 09:00 - will work when character is smaller than the block
              //TODO: test then character is larger than the block
              if ((clt>=blt) && (clt<=brt) && (crt>=blt) && (crt>=brt)) { 
                element.hasCollidedRight = true;
                console.log("collided: 0300"); 
              }
              if ((clt<=blt) && (clt<=brt) && (crt>=blt) && (crt<=brt)) { 
                element.hasCollidedLeft = true;
                console.log("collided: 0900"); 
              }
            }  
            hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) || (element.hasCollidedLeft || element.hasCollidedRight);            
          } 
        });
      }
      return hasCollidedAny;
    };
  }