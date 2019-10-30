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
    enable_left: boolean = true;
    enable_right: boolean = true;
    enable_jump: boolean = true;
    isFalling: boolean = false;
    hasCollided: boolean = false;
    platform_y: number = 0;
    lastMoveRight : boolean = false;
    lastMoveLeft : boolean = false;
    lastMoveUp : boolean = false;

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
      return this.level1.sourceY + vert < topEdge ? topEdge - this.level1.sourceY : vert;
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
      if (this.enable_right && (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D)) {
        this.key_walk_right = true;
      } else if (this.enable_left && (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A)) {
        this.key_walk_left = true;
      } else if (this.enable_jump && (event.keyCode == KEY_CODE.SPACE)) {
        this.key_jump = true;
        this.enable_jump = false;
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

    // private detectCollision(vert: number, scroll: number, collided: BoundingBox[]) {
    //   if (vert < 0) { //IS JUMPING          
    //     if (collided.length > 0) { //IS COLLIDED
    //       collided.forEach(element => {
    //         var counter = 0;
    //         while ((counter >= vert) && !hasCollided) {
    //           var hasCollided = Helper.collideWithBox(this.mario, [element], counter, scroll);
    //           if (!hasCollided)
    //             counter--;
    //         }
    //         vert = counter; //IS ACCURATE VERT
    //       });
    //       this.mario.isFalling = true; //IS FALLING
    //     }
    //   }
    //   else if (vert >= 0) { //IS FALLING
    //     if (collided.length > 0) { //IS COLLIDED
    //       collided.forEach(element => {
    //         var counter = 0;
    //         while ((counter <= vert) && !hasCollided) {
    //           var hasCollided = Helper.collideWithBox(this.mario, [element], counter, scroll);
    //           if (!hasCollided)
    //             counter++;
    //         }
    //         vert = counter; //IS ACCURATE VERT
    //       });
    //       this.setPlatform(); //SET PLATFORM
    //       //TODO: Compare box to mario (top AND bottom and inbetween) 
    //       //Make incremental checks to get an accurate number
    //       //If collided then step scroll = 0
    //       if (collided[0].boundingBox.y == this.mario.boundingBox.y) {
    //         scroll = 0; //IS COLLIDED, STOP SCROLLING
    //       }
    //     }
    //     else {
    //       this.clearPlatform(); //CLEAR PLATFORM
    //     }
    //     this.mario.isFalling = !(vert == 0);
    //   }
    //   return { vert, scroll };
    // }
  
    private getCollided(){
      var collided: BoundingBox[] = [];

      //Next, determine if character will collide with any elements; add elements to array
      this.blocks.forEach(element => {
        if (Helper.collideWithBox(this.mario, [ element ])) {
          collided.push( element );
          return;
        }
      });
      this.pipes.forEach(element => {
        if (Helper.collideWithBox(this.mario, [ element ])) {
          collided.push( element );
          return;
        }
      });
      return collided;
    }
  
  
    update () {
      if (!this.key_jump) this.platform_y = 0;

      let collided : BoundingBox[] = this.getCollided();
      if (collided.length != 0){
        console.log("collided.length:" + collided.length);
        if (collided[0].hasCollided){
          if (this.lastMoveUp && collided[0].hasCollidedBottom){
            this.key_jump = false;

          } else if (collided[0].hasCollidedTop){
            this.enable_jump = true;
            this.platform_y = this.level1.sourceY;

          } else {
            if (this.lastMoveRight && collided[0].hasCollidedLeft){ 
              this.key_walk_right = false;
              this.enable_right = false;

            } else if (this.lastMoveLeft && collided[0].hasCollidedRight){
              this.key_walk_left = false;
              this.enable_left = false;
            }
          }
        }
      }
      this.lastMoveRight = this.key_walk_right;
      this.lastMoveLeft = this.key_walk_left;
      this.lastMoveUp = this.key_jump;

      let bg_scroll_vert: number = 0,
        bg_scroll_horz: number = 0,
        char_scroll_horz: number = 0,
        char_scroll_vert: number = 0;

      if (this.lastMoveRight) {
        char_scroll_horz = this.mario.canScrollRight(Constants.CHAR_MOVE);
        if (char_scroll_horz < Constants.CHAR_MOVE){
          bg_scroll_horz = this.canScrollRight(Constants.CHAR_MOVE - char_scroll_horz);
        }
        this.enable_left = true;

      } else if (this.lastMoveLeft) {
        char_scroll_horz = this.mario.canScrollLeft(0 - Constants.CHAR_MOVE);
        if (char_scroll_horz > 0 - Constants.CHAR_MOVE){
          bg_scroll_horz = this.canScrollLeft(0 - Constants.CHAR_MOVE - char_scroll_horz);
        }
        this.enable_right = true;
      }
      if (this.lastMoveUp) {
        bg_scroll_vert = this.canScrollUp(Constants.CHAR_JUMP, Constants.CHAR_MAX_JUMP);
        if (bg_scroll_vert == 0){
          this.key_jump = false;
        }
      } else {
        bg_scroll_vert = this.canScrollDown();
        if (bg_scroll_vert == 0){
          this.enable_jump = true;
        }
      }
      //Get NEW MARIO ACTION & UPDATE MARIO SPRITE ANIMATION
      this.mario.update({
        bg_scroll_vert : bg_scroll_vert,
        bg_scroll_horz : bg_scroll_horz,
        char_scroll_vert : char_scroll_vert,
        char_scroll_horz : char_scroll_horz });

      this.enemies.forEach(element => {          
        element.update({
            vert : 0 - bg_scroll_vert, 
            scroll : 0 - bg_scroll_horz, 
            platform_y : this.platform_y }); //FG elements move opposite the BG element
      });
      this.blocks.forEach(element => {          
        element.update({
          vert : 0 - bg_scroll_vert, 
          scroll : 0 - bg_scroll_horz, 
          platform_y : this.platform_y }); //FG elements move opposite the BG element
      });
      this.pipes.forEach(element => {
        element.update({
          vert : 0 - bg_scroll_vert, 
          scroll : 0 - bg_scroll_horz, 
          platform_y : this.platform_y }); //FG elements should move opposite the BG element
      });
      this.level1.sourceX += bg_scroll_horz;
      this.level1.sourceY += bg_scroll_vert;
    };
  
    render () {
      this.level1.render();
      this.blocks.forEach(element => { element.render(); });
      this.enemies.forEach(element => { element.render(); });
      this.mario.render();  
    };
  }
  