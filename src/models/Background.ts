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

    canScrollRight (scroll: number = Constants.CHAR_HORZ) {
      var rightEdge = this.level1.image.width - this.level1.frameWidth;
      return this.level1.sourceX + scroll > rightEdge ? rightEdge - this.level1.sourceX : scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_HORZ) {
      var leftEdge = 0;
      return this.level1.sourceX + scroll < leftEdge ? leftEdge - this.level1.sourceX : scroll;
    };
  
    canScrollUp (vert: number = Constants.CHAR_VERT,  max: number = Constants.CHAR_MAX_VERT) {
      var topEdge = this.platform_y - max; //-1, -10, -100, -200
      return this.level1.sourceY + vert < topEdge ? topEdge - this.level1.sourceY : vert;
    };
  
    canScrollDown (vert: number = Constants.GRAVITY) {
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
        this.enable_left = true;
      } else if (this.enable_left && (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A)) {
        this.key_walk_left = true;
        this.enable_right = true;
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
  
    private getCollided(v: number = 0, s: number = 0){
      var collided: BoundingBox[] = [];

      //Next, determine if character will collide with any elements; add elements to array
      this.blocks.forEach(element => {
        if (Helper.collideWithBox(this.mario, [ element ], v, s)) {
          collided.push( element );
          return;
        }
      });
      this.pipes.forEach(element => {
        if (Helper.collideWithBox(this.mario, [ element ], v, s)) {
          collided.push( element );
          return;
        }
      });
      return collided;
    }
  
  
    update () {
      if (!this.key_jump) this.platform_y = 0;
      
      let bg_vert: number = 0, bg_horz: number = 0, ch_vert: number = 0, ch_horz: number = 0;

      if (this.key_walk_right) {
        ch_horz = this.mario.canScrollRight(Constants.CHAR_HORZ);
        bg_horz = (ch_horz < Constants.CHAR_HORZ) ? this.canScrollRight(Constants.CHAR_HORZ - ch_horz) : 0;

      } else if (this.key_walk_left) {
        ch_horz = this.mario.canScrollLeft(0 - Constants.CHAR_HORZ);
        bg_horz = (ch_horz > 0 - Constants.CHAR_HORZ) ? this.canScrollLeft(0 - Constants.CHAR_HORZ - ch_horz) : 0;
      }
      if (this.key_jump) {
        bg_vert = this.canScrollUp(Constants.CHAR_VERT, Constants.CHAR_MAX_VERT);
        this.key_jump = (bg_vert != 0);

      } else {
        bg_vert = this.canScrollDown();
        this.enable_jump = (bg_vert == 0); 
      }
      let collided : BoundingBox[] = this.getCollided(
        bg_vert + ch_vert, 
        bg_horz + ch_horz);

      if (collided.length == 2) console.log("collided.length:" + collided.length);        

      collided.forEach(element => {
        if (element.hasCollided){
          if (this.key_jump && element.hasCollidedBottom){
            this.key_jump = this.enable_jump = false;
            bg_vert = ch_vert = 0;

          } else if (element.hasCollidedTop){
            this.enable_jump = true;
            this.platform_y = this.level1.sourceY;
            bg_vert = ch_vert = 0;

          } else {
            if (this.key_walk_right && element.hasCollidedLeft){ 
              this.key_walk_right = this.enable_right = false;
              bg_horz = ch_horz = 0;

            } else if (this.key_walk_left && element.hasCollidedRight){
              this.key_walk_left = this.enable_left = false;
              bg_horz = ch_horz = 0;
            }
          }
        }
      });
      //Get NEW MARIO ACTION & UPDATE MARIO SPRITE ANIMATION
      this.mario.update({
        bg_scroll_vert : bg_vert,
        bg_scroll_horz : bg_horz,
        char_scroll_vert : ch_vert,
        char_scroll_horz : ch_horz });

      this.enemies.forEach(element => {          
        element.update({
            vert : 0 - bg_vert, 
            scroll : 0 - bg_horz, 
            platform_y : this.platform_y }); //FG elements move opposite the BG element
      });
      this.blocks.forEach(element => {          
        element.update({
          vert : 0 - bg_vert, 
          scroll : 0 - bg_horz, 
          platform_y : this.platform_y }); //FG elements move opposite the BG element
      });
      this.pipes.forEach(element => {
        element.update({
          vert : 0 - bg_vert, 
          scroll : 0 - bg_horz, 
          platform_y : this.platform_y }); //FG elements should move opposite the BG element
      });
      this.level1.sourceX += bg_horz;
      this.level1.sourceY += bg_vert;
    };
  
    render () {
      this.level1.render();
      this.blocks.forEach(element => { element.render(); });
      this.enemies.forEach(element => { element.render(); });
      this.mario.render();  
    };
  }
  