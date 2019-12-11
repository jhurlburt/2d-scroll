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
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

export class Level {
    private bounds: Sprite;
    private mario: Character;
    private enemies: Enemy[];
    private terras: BoundingBox[];
    private blocks: BoundingBox[];
    private pipes: BoundingBox[];
    private key_walk_left: boolean = false;
    private key_walk_right: boolean = false;
    private key_jump: boolean = false;
    private enable_left: boolean = true;
    private enable_right: boolean = true;
    private enable_jump: boolean = true;
    private platform_y: number = 0;
    private historyLog : string [] = [];

    constructor(options: Sprite, character: Character) {
      this.bounds = options;
      this.mario  = character;
      this.terras = [];
      this.enemies = [];
      this.pipes  = [];
      this.blocks = []; 
    }

    @Output() notifyParent: EventEmitter<any> = new EventEmitter();

    private canScrollRight (scroll: number = Constants.CHAR_HORZ) {
      let rightEdge = this.bounds.image.width - this.bounds.frameWidth;
      return this.bounds.sourceX + scroll > rightEdge ? rightEdge - this.bounds.sourceX : scroll;
    };
  
    private canScrollLeft (scroll: number = 0 - Constants.CHAR_HORZ) {
      let leftEdge = 0;
      return this.bounds.sourceX + scroll < leftEdge ? leftEdge - this.bounds.sourceX : scroll;
    };
  
    private canScrollUp (vert: number = Constants.CHAR_JUMP,  max: number = Constants.CHAR_MAX_VERT) {
      let topEdge = this.platform_y - max; //-1, -10, -100, -200
      return this.bounds.sourceY + vert < topEdge ? topEdge - this.bounds.sourceY : vert;
    };
  
    private canScrollDown (vert: number = Constants.GRAVITY) {
      var bottomEdge = this.platform_y;
      return this.bounds.sourceY + vert > bottomEdge ? this.bounds.sourceY - bottomEdge : vert; //-1
    };
  
    public handleKeyboardEvent(event: KeyboardEvent){
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

    private getCollisionObjects(src: BoundingBox, bg_v1: number = 0, ch_v2: number = 0, bg_s2: number = 0, ch_s2: number = 0){
      let collided: BoundingBox[] = [];

      this.terras.forEach(element => {
        if (Helper.detectCollisionList(src, [ element ], bg_v1, ch_v2, bg_s2, ch_s2)) { collided.push( element ); }
      });
      this.blocks.forEach(element => {
        if (Helper.detectCollisionList(src, [ element ], bg_v1, ch_v2, bg_s2, ch_s2)) { collided.push( element ); }
      });
      this.pipes.forEach(element => {
        if (Helper.detectCollisionList(src, [ element ], bg_v1, ch_v2, bg_s2, ch_s2)) { collided.push( element ); }
      });
      return collided;
    }

    public getBounds() {
      if (this.bounds != null){
        return this.bounds; 
      }
    } 

    public addEnemy (enemy : Enemy) {
      this.enemies.push(enemy);
    }

    private removeEnemy (enemy : Enemy){      
      const index = this.enemies.indexOf(enemy, 0);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }

    public addTerras (terras : Terra []) {
      terras.forEach(terra => {
        this.addTerra(terra);
      });
    } 

    private addTerra (terra : Terra) {
      this.terras.push(terra);
    } 

    private removeTerra (terra : Terra){      
      const index = this.terras.indexOf(terra, 0);
      if (index > -1) {
        this.terras.splice(index, 1);
      }
    }

    public addBlocks (blocks : Block []){
      blocks.forEach(block => {
        this.addBlock(block);        
      });
    }

    private addBlock (block : Block) {
      this.blocks.push(block);
    }

    private removeBlock (block : Block){      
      const index = this.blocks.indexOf(block, 0);
      if (index > -1) {
        this.blocks.splice(index, 1);
      }
    }

    public addPipes (pipes : StandPipe []){
      pipes.forEach(pipe => {
        this.addPipe(pipe);        
      });
    }

    private addPipe(pipe : StandPipe){
      this.pipes.push(pipe);
    }

    private removePipe (pipe : StandPipe){      
      const index = this.pipes.indexOf(pipe, 0);
      if (index > -1) {
        this.pipes.splice(index, 1);
      }
    }

    public updateFrame () {
      let bg_vert: number = 0, bg_horz: number = 0
        , ch_vert: number = 0, ch_horz: number = 0
        , en_vert: number = 0, en_horz: number = 0;
  
      //RESET COLLISIONS
      this.resetFrame();

      //GET HORIZONTAL MOVEMENT
      if ( this.key_walk_right ) {
        ch_horz = this.mario.canScrollRight( Constants.CHAR_HORZ );
        bg_horz = (ch_horz < Constants.CHAR_HORZ) ? this.canScrollRight(Constants.CHAR_HORZ - ch_horz) : 0;
      } else if ( this.key_walk_left ) {
        ch_horz = this.mario.canScrollLeft( 0 - Constants.CHAR_HORZ );
        bg_horz = (ch_horz > 0 - Constants.CHAR_HORZ) ? this.canScrollLeft(0 - Constants.CHAR_HORZ - ch_horz) : 0;
      }

      //GET VERTICAL MOVEMENT
      if (this.key_jump) {
        bg_vert = this.canScrollUp( Constants.CHAR_JUMP, Constants.CHAR_MAX_VERT );
        this.key_jump = bg_vert != 0;
      } else {
        bg_vert =  this.canScrollDown();
        ch_vert = ( bg_vert < Constants.GRAVITY ) ? this.mario.canScrollDown( Constants.GRAVITY ) : 0;  
        this.enable_jump = ( ch_vert + bg_vert ) == 0; 
      }
     
      //CHARACTER COLLISION DETECTION
      let collided : BoundingBox[] = this.getCollisionObjects(this.mario, bg_vert, ch_vert, bg_horz, ch_horz);
      collided.forEach(element => {
        if (element.collisionObjectId.includes( this.mario.id )){
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

      //UPDATE ENEMIES
      this.enemies.forEach(enemy => {
        en_vert = Constants.GRAVITY;
        en_horz = ( enemy.moveLeft ) ? 0 - Constants.ENEM_HORZ : Constants.ENEM_HORZ;

        let collided: BoundingBox[] = this.getCollisionObjects(enemy, bg_vert, en_vert, bg_horz, en_horz);
        collided.forEach(obj => {
          if (obj.collisionObjectId.includes( enemy.id )){
            if (obj.hasCollidedTop.includes( enemy.id )) {
              en_vert = 0;
            } else if (obj.hasCollidedLeft.includes( enemy.id )) { 
              enemy.moveLeft = true;
              en_horz = ( enemy.moveLeft ) ? 0 - Constants.ENEM_HORZ : Constants.ENEM_HORZ;
            } else if (obj.hasCollidedRight.includes( enemy.id )) {
              enemy.moveLeft = false;
              en_horz = ( enemy.moveLeft ) ? 0 - Constants.ENEM_HORZ : Constants.ENEM_HORZ;
            }
          }
        });
        if (collided.length < 1) en_horz = 0;

        enemy.update({
          bg_scroll_vert : 0-bg_vert
          , bg_scroll_horz : 0-bg_horz
          , char_scroll_vert : en_vert
          , char_scroll_horz : en_horz   
        });

        if (Helper.isCollided(this.mario, enemy)){
          this.mario.collisionObjectId.push( enemy.id );
        }
        if ((enemy.getBounds().x + enemy.getBounds().frameWidth) < 0){
          this.removeEnemy(enemy);
        }
      });//this.enemies.forEach...

      //UPDATE CHARACTER
      this.mario.update({
        bg_scroll_vert : bg_vert,
        bg_scroll_horz : bg_horz,
        char_scroll_vert : ch_vert,
        char_scroll_horz : ch_horz });
              
      //UPDATE STATIC OBJECTS
      this.pipes.forEach(element => { element.update({vert : 0-bg_vert, scroll : 0-bg_horz}); });
      this.blocks.forEach(element =>{ element.update({vert : 0-bg_vert, scroll : 0-bg_horz}); });
      this.terras.forEach(element =>{ element.update({vert : 0-bg_vert, scroll : 0-bg_horz}); });  

      //UPDATE BOUNDS X/Y
      this.bounds.sourceX += bg_horz;
      this.bounds.sourceY += bg_vert;

      //CHECKPOINT LOGIC
      let mario_x = this.mario.getBounds().x; 
      let orig_x = mario_x + this.bounds.sourceX; 
      let enemy_x = mario_x + 600;
      let enemy_y = 0;
      if ((orig_x > 1200 && !this.historyLog.includes("Checkpoint1"))
        || (orig_x > 2400 && !this.historyLog.includes("Checkpoint2"))
        || (orig_x > 3600 && !this.historyLog.includes("Checkpoint3"))){
        let count = (orig_x - (orig_x % 1200)) / 1200;        
        this.historyLog.push("Checkpoint" + count);
        this.notifyParent.emit({ name : "Checkpoint", x : enemy_x, y : enemy_y, moveLeft : (count % 2) == 0 });          
      }
    };
  
    public renderFrame () {
      this.bounds.render();
      this.blocks.forEach(element => { element.render(); });
      //Do not render pipes! No images to render!!
      this.enemies.forEach(element => { element.render(); });
      this.mario.render();  
    };
  }