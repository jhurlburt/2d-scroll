import { Sprite } from '../models/Sprite';
import { Helper } from '../helpers/Helper';
import { Constants } from '../helpers/Constants';
import { Character } from '../models/Character';
import { BoundingBox } from '../interface/BoundingBox'; 
import { KEY_CODE } from '../helpers/Keyboard';
import { Enemy } from './Enemy';
import { StandPipe } from './StandPipe';
import { Block } from './Block';

export class Level {
    level1: Sprite;
    mario: Character;
    enemies: BoundingBox[];
    blocks: BoundingBox[];
    pipes: BoundingBox[];
    key_walk_left: boolean = false;
    key_walk_right: boolean = false;
    key_jump: boolean = false;
    isFalling: boolean = false;
    hasCollided: boolean = false;
    platform_y: number = 0;
    
    constructor(options: Sprite, character: Character, enemies: Enemy[], pipes: StandPipe[], blocks: Block[] ) {
      this.level1 = options;
      this.mario = character;
      this.enemies = enemies;
      this.pipes = pipes;
      this.blocks = blocks; 
    }

    canScrollRight (scroll: number = Constants.CHAR_MOVE) {
      var rightEdge = this.level1.image.width - this.level1.frameWidth;
      return this.level1.sourceX + scroll > rightEdge ? rightEdge - this.level1.sourceX : scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_MOVE) {
      var leftEdge = 0;
      return this.level1.sourceX + scroll < leftEdge ? leftEdge - this.level1.sourceX : scroll;
    };
  
    canScrollUp (vert: number = Constants.CHAR_JUMP,  max: number = Constants.CHAR_MAX_JUMP) {
      var topEdge = this.platform_y - max; //-1, -10, -100, -200
      return this.level1.sourceY + vert < topEdge ? this.level1.sourceY - topEdge : vert; //-201 => 
    };
  
    canScrollDown (vert: number = Constants.CHAR_FALL) {
      var bottomEdge = this.platform_y;
      return this.level1.sourceY + vert > bottomEdge ? this.level1.sourceY - bottomEdge : vert; //-1
    };
  
    setPlatform () {
      this.platform_y = this.level1.sourceY;
    };
  
    clearPlatform () {
      this.platform_y = 0;
    };

    public handleKeyDownEvent(event: KeyboardEvent){
      // console.log("window:keydown => %s", event.keyCode.toString());
      if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D) {
        this.key_walk_right = true;
      } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A) {
        this.key_walk_left = true;
      } else if (event.keyCode == KEY_CODE.SPACE) {
        this.key_jump = true;
      }
    }

    public handleKeyUpEvent(event: KeyboardEvent){
      if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D) {
        this.key_walk_right = false;
      } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A) {
        this.key_walk_left = false;
      } else if (event.keyCode == KEY_CODE.SPACE) {
        this.key_jump = false;
      }  
    }

    private detectCollision(vert: number, scroll: number, collided: BoundingBox[]) {
      if (vert < 0) { //IS JUMPING          
        if (collided.length > 0) { //IS COLLIDED
          collided.forEach(element => {
            var counter = 0;
            while ((counter >= vert) && !hasCollided) {
              var hasCollided = Helper.collideWithBox(this.mario, [element], counter, scroll);
              if (!hasCollided)
                counter--;
            }
            vert = counter; //IS ACCURATE VERT
          });
          this.mario.isFalling = true; //IS FALLING
        }
      }
      else if (vert >= 0) { //IS FALLING
        if (collided.length > 0) { //IS COLLIDED
          collided.forEach(element => {
            var counter = 0;
            while ((counter <= vert) && !hasCollided) {
              var hasCollided = Helper.collideWithBox(this.mario, [element], counter, scroll);
              if (!hasCollided)
                counter++;
            }
            vert = counter; //IS ACCURATE VERT
          });
          this.setPlatform(); //SET PLATFORM
          //TODO: Compare box to mario (top AND bottom and inbetween) 
          //Make incremental checks to get an accurate number
          //If collided then step scroll = 0
          if (collided[0].boundingBox.y == this.mario.boundingBox.y) {
            scroll = 0; //IS COLLIDED, STOP SCROLLING
          }
        }
        else {
          this.clearPlatform(); //CLEAR PLATFORM
        }
        this.mario.isFalling = !(vert == 0);
      }
      return { vert, scroll };
    }
  
    private getCollided(vert: number, scroll: number){
      var collided: BoundingBox[] = [];
      //Next, determine if character will collide with any elements; add elements to array
      this.blocks.forEach(element => {
        if (Helper.collideWithBox(this.mario, [ element ], vert, scroll)) {
          collided.push( element );
          return;
        }
      });
      this.pipes.forEach(element => {
        if (Helper.collideWithBox(this.mario, [ element ], vert, scroll)) {
          collided.push( element );
          return;
        }
      });
      return collided;
    }
  
  
    update () {
      //First, determine if character can move within the constraints of the background        
      // let vert: number = (this.key_jump && !this.mario.isFalling) ? this.canScrollUp() : this.canScrollDown(),
      // scroll: number = (this.key_walk_right) ? this.canScrollRight() : (this.key_walk_left) ? this.canScrollLeft() : 0;

      let vert: number = 0,
      scroll: number = 0,
      char_scroll: number = 0,
      char_vert: number = 0;

      // if ((this.key_jump && !this.mario.isFalling)){
      //   vert = this.canScrollUp(); //default: -3
      //   let v = 0, h = 0;
      //   while (v++ < vert){
      //     //update blocks
      //     //update pipes
      //   } 
      // } else {
      //   vert = this.canScrollDown(); //default: +4
      // }
      // if (vert != 0){
        
      // }

      
      if (this.key_walk_right){
        scroll = this.canScrollRight(); //default: 2
        char_scroll = this.mario.canScrollRight(scroll);
        scroll -= char_scroll;

        console.log("scroll:" + scroll);
        console.log("char_scroll:" + char_scroll);

      } else if (this.key_walk_left){
        scroll = this.canScrollLeft(); //default: -2
        char_scroll = this.mario.canScrollLeft(scroll);
        scroll += char_scroll;
      }

      let collided: BoundingBox[] = this.getCollided(vert, scroll);

      //Character is falling if:
      //1. Is ascending (jumping) and has collided with an element
      //2. Is descending
      this.mario.isFalling = false;
      
      //Next, determine if character is ascending, descending or neither        
      ({ vert, scroll } = this.detectCollision(vert, scroll, collided));        
      //Next, update all elements

      //Get NEW MARIO ACTION & UPDATE MARIO SPRITE ANIMATION
      this.mario.update(char_vert, char_scroll);

      this.enemies.forEach(element => {          
        element.update(0 - scroll, 0 - vert, this.platform_y); //FG elements move opposite the BG element
      });
      //UPDATE FG/BG
      this.blocks.forEach(element => {          
        element.update(0 - scroll, 0 - vert, this.platform_y); //FG elements move opposite the BG element
      });
      this.pipes.forEach(element => {
        element.update(0 - scroll, 0 - vert, this.platform_y); //FG elements should move opposite the BG element
      });      
      this.level1.sourceX += scroll;
      this.level1.sourceY += vert;
    };
  
    render () {
      this.level1.render();
      this.blocks.forEach(element => { element.render(); });
      this.enemies.forEach(element => { element.render(); });
      this.mario.render();  
    };
  }
  