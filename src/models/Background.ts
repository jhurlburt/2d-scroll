import { Sprite } from '../models/Sprite';
import { Helper } from '../helpers/Helper';
import { Constants } from '../helpers/Constants';
import { Character } from '../models/Character';
import { BoundingBox } from '../interface/BoundingBox'; 
import { KEY_CODE } from '../helpers/Keyboard';
import { Enemy } from './Enemy';
import { StandPipe } from './StandPipe';
import { Block } from './Block';
import { Terra } from './Terra';

export class Level {
    bounds: Sprite;
    terras: Terra[];
    mario: Character;
    enemies: Enemy[];
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
    checkpoint: number = 0;

    constructor(options: Sprite, character: Character, terras: Terra[], enemies: Enemy[], pipes: StandPipe[], blocks: Block[]) {
      this.bounds = options;
      this.mario = character;
      this.terras = terras;
      this.enemies = enemies;
      this.pipes = pipes;
      this.blocks = blocks; 
    }

    canScrollRight (scroll: number = Constants.CHAR_HORZ) {
      let rightEdge = this.bounds.image.width - this.bounds.frameWidth;
      return this.bounds.sourceX + scroll > rightEdge ? rightEdge - this.bounds.sourceX : scroll;
    };
  
    canScrollLeft (scroll: number = 0 - Constants.CHAR_HORZ) {
      let leftEdge = 0;
      return this.bounds.sourceX + scroll < leftEdge ? leftEdge - this.bounds.sourceX : scroll;
    };
  
    canScrollUp (vert: number = Constants.CHAR_JUMP,  max: number = Constants.CHAR_MAX_VERT) {
      let topEdge = this.platform_y - max; //-1, -10, -100, -200
      return this.bounds.sourceY + vert < topEdge ? topEdge - this.bounds.sourceY : vert;
    };
  
    canScrollDown (vert: number = Constants.GRAVITY) {
      var bottomEdge = this.platform_y;
      return this.bounds.sourceY + vert > bottomEdge ? this.bounds.sourceY - bottomEdge : vert; //-1
    };
  
    handleKeyboardEvent(event: KeyboardEvent){
      if (event.type == "keydown"){
        if (this.enable_right && (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D)) {
          this.key_walk_right = true;
          this.enable_left = true;
        } else if (this.enable_left && (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A)) {
          this.key_walk_left = true;
          this.enable_right = true;
        } else if (this.enable_jump && (event.keyCode == KEY_CODE.SPACE)) {
          this.key_jump = true;
        }
      } else if (event.type == "keyup"){
        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D) {
          this.key_walk_right = false;
        } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A) {
          this.key_walk_left = false;
        } else if (event.keyCode == KEY_CODE.SPACE) {
          this.key_jump = false;
        }    
      }
    }
  
    private resetFrame(){
      if (!this.key_jump) this.platform_y = 0; //reset platform
      this.mario.resetCollided();      
      this.terras.forEach( element => { element.resetCollided(); });
      this.enemies.forEach( element => { element.resetCollided(); });
      this.blocks.forEach( element => { element.resetCollided(); });
      this.pipes.forEach( element => { element.resetCollided(); });
    }

    private getCollisionObjects(src: BoundingBox, v: number = 0, s: number = 0){
      var collided: BoundingBox[] = [];

      this.terras.forEach(element => {
        if (Helper.collideWithBox(src, [ element ], v, s)) { collided.push( element ); }
      });
      this.blocks.forEach(element => {
        if (Helper.collideWithBox(src, [ element ], v, s)) { collided.push( element ); }
      });
      this.pipes.forEach(element => {
        if (Helper.collideWithBox(src, [ element ], v, s)) { collided.push( element ); }
      });
      return collided;
    }
  
    updateFrame () {
      let bg_vert: number = 0, bg_horz: number = 0
        , ch_vert: number = 0, ch_horz: number = 0
        , en_vert: number = 0, en_horz: number = 0
        , orig_x: number = 0, dest_x: number = 0;

      orig_x = this.mario.bounds.x + this.bounds.sourceX; 
       
      this.resetFrame();
      if ( this.key_walk_right ) {
        ch_horz = this.mario.canScrollRight( Constants.CHAR_HORZ );
        bg_horz = (ch_horz < Constants.CHAR_HORZ) ? this.canScrollRight(Constants.CHAR_HORZ - ch_horz) : 0;
      } else if ( this.key_walk_left ) {
        ch_horz = this.mario.canScrollLeft( 0 - Constants.CHAR_HORZ );
        bg_horz = (ch_horz > 0 - Constants.CHAR_HORZ) ? this.canScrollLeft(0 - Constants.CHAR_HORZ - ch_horz) : 0;
      }

      dest_x = orig_x + ch_horz + bg_horz;

      console.log("mario x: " + dest_x);         
      console.log("mario x + w: " + (dest_x + this.mario.bounds.frameWidth)); 

      if (this.key_jump) {
        bg_vert = this.canScrollUp( Constants.CHAR_JUMP, Constants.CHAR_MAX_VERT );
        this.key_jump = (bg_vert != 0);
      } else {
        bg_vert =  this.canScrollDown();
        ch_vert = ( bg_vert < Constants.GRAVITY ) ? this.mario.canScrollDown( Constants.GRAVITY ) : 0;  
        this.enable_jump = ( ch_vert + bg_vert ) == 0; 
      }
     
      let collided : BoundingBox[] = this.getCollisionObjects(this.mario, bg_vert + ch_vert, bg_horz + ch_horz);
      collided.forEach(element => {
        if (element.hasCollided){
          if (element.hasCollidedBottom.includes( this.mario.id )) {
            this.key_jump = false;  
            this.enable_jump = false;
            this.enable_left = true;
            this.enable_right = true;
            bg_vert = ch_vert = 0;
          } else if (element.hasCollidedTop.includes( this.mario.id )) {
            this.platform_y = this.bounds.sourceY;
            this.enable_jump = true;
            this.enable_left = true;
            this.enable_right = true;
            bg_vert = ch_vert = 0;
          } else if (element.hasCollidedLeft.includes( this.mario.id )) { 
            this.enable_right = false;
            bg_horz = ch_horz = 0;
          } else if (element.hasCollidedRight.includes( this.mario.id )) {
            this.enable_left = false;
            bg_horz = ch_horz = 0;
          }
        }
      });
       
      //Trigger 2:Remove Enemy
      //          When enemy passes outside the bounds of the level, remove from game   
      //          When enemy passes outside the bounds of the level, remove from game   
      //Trigger 3:Collide with Enemy
      //          When mario makes contact with enemy, play animation, end turn
      //Trigger 4:Fall into Void
      //          When mario falls into void, play animation, end turn

      this.mario.update({
        bg_scroll_vert : bg_vert,
        bg_scroll_horz : bg_horz,
        char_scroll_vert : ch_vert,
        char_scroll_horz : ch_horz });

      this.mario.resetCollided();
  
      this.enemies.forEach(enemy => {
        en_vert = Constants.GRAVITY;
        en_horz = ( enemy.moveLeft ) ? 0 - Constants.ENEM_HORZ : Constants.ENEM_HORZ;

        collided = this.getCollisionObjects(enemy, bg_vert + en_vert, bg_horz + en_horz);
        if (collided.length > 0) {  
          collided.forEach(obj => {
            if (obj.hasCollided){
              if (obj.hasCollidedTop.includes( enemy.id )) {
                en_vert = 0;
              } else if (obj.hasCollidedLeft.includes( enemy.id )) { 
                enemy.moveLeft = true;
                en_horz = 0;
              } else if (obj.hasCollidedRight.includes( enemy.id )) {
                enemy.moveLeft = false;
                en_horz = 0;
              }
            }
          });
        } else {
          en_horz = 0;
        }
        enemy.update({
          bg_scroll_vert : 0-bg_vert
          , bg_scroll_horz : 0-bg_horz
          , char_scroll_vert : en_vert
          , char_scroll_horz : en_horz   
        });
        
        if ((enemy.bounds.x + enemy.bounds.frameWidth < this.bounds.x)){
          const index = this.enemies.indexOf(enemy, 0);
          if (index > -1) {
            this.enemies.splice(index, 1);
          }
        }
      });

      this.pipes.forEach(element => {
        element.update({
          vert : 0-bg_vert
          , scroll : 0-bg_horz
          , platform_y : this.platform_y 
        });
      });  

      this.blocks.forEach(element => {          
        element.update({
          vert : 0-bg_vert
          , scroll : 0-bg_horz
          , platform_y : this.platform_y 
        });
      });

      this.terras.forEach(element => {
        element.update({
          vert : 0-bg_vert
          , scroll : 0-bg_horz
          , platform_y : this.platform_y 
        });
      });  
      
      this.bounds.sourceX += bg_horz;
      this.bounds.sourceY += bg_vert;
    };
  
    renderFrame () {
      this.bounds.render();
      this.blocks.forEach(element => { element.render(); });
      this.enemies.forEach(element => { element.render(); });
      this.mario.render();  
    };
  }