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
    private bounds: Sprite;
    private terras: Terra[];
    private enemies: Enemy[];
    private blocks: BoundingBox[];
    private pipes: BoundingBox[];
    private key_walk_left: boolean = false;
    private key_walk_right: boolean = false;
    private key_jump: boolean = false;
    private enable_left: boolean = true;
    private enable_right: boolean = true;
    private enable_jump: boolean = true;
    private platform_y: number = 0;
    checkpoint: number = 0;
    mario: Character;
    // private isFalling: boolean = false;
    // private hasCollided: boolean = false;
    // private lastMoveRight : boolean = false;
    // private lastMoveLeft : boolean = false;
    // private lastMoveUp : boolean = false;

    constructor(options: Sprite, character: Character /*, terras: Terra[], enemies: Enemy[], pipes: StandPipe[], blocks: Block[]*/ ) {
      this.bounds = options;
      this.mario  = character;
      this.terras = [];
      this.enemies = [];
      this.pipes  = [];
      this.blocks = []; 
    }

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
      let helper: Helper = new Helper();

      this.terras.forEach(element => {
        if (helper.collideWithBox(src, [ element ], bg_v1, ch_v2, bg_s2, ch_s2)) { collided.push( element ); }
      });
      this.blocks.forEach(element => {
        if (helper.collideWithBox(src, [ element ], bg_v1, ch_v2, bg_s2, ch_s2)) { collided.push( element ); }
      });
      this.pipes.forEach(element => {
        if (helper.collideWithBox(src, [ element ], bg_v1, ch_v2, bg_s2, ch_s2)) { collided.push( element ); }
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

    public removeEnemy (enemy : Enemy){      
      const index = this.enemies.indexOf(enemy, 0);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }

    public addTerra (terra : Terra) {
      this.terras.push(terra);
    } 

    public removeTerra (terra : Terra){      
      const index = this.terras.indexOf(terra, 0);
      if (index > -1) {
        this.terras.splice(index, 1);
      }
    }

    public addBlock (block : Block) {
      this.blocks.push(block);
    }

    public removeBlock (block : Block){      
      const index = this.blocks.indexOf(block, 0);
      if (index > -1) {
        this.blocks.splice(index, 1);
      }
    }

    public addPipe(pipe : StandPipe){
      this.pipes.push(pipe);
    }

    public removePipe (pipe : StandPipe){      
      const index = this.pipes.indexOf(pipe, 0);
      if (index > -1) {
        this.pipes.splice(index, 1);
      }
    }

    public updateFrame () {
      let bg_vert: number = 0, bg_horz: number = 0
        , ch_vert: number = 0, ch_horz: number = 0
        , en_vert: number = 0, en_horz: number = 0
        , orig_x: number = 0, dest_x: number = 0;

      orig_x = this.mario.getBounds().x + this.bounds.sourceX; 
       
      this.resetFrame();
      if ( this.key_walk_right ) {
        ch_horz = this.mario.canScrollRight( Constants.CHAR_HORZ );
        bg_horz = (ch_horz < Constants.CHAR_HORZ) ? this.canScrollRight(Constants.CHAR_HORZ - ch_horz) : 0;
        dest_x = orig_x + ch_horz + bg_horz;
        // console.log("lt: " + dest_x + ", rt: " + (dest_x + this.mario.bounds.frameWidth));         
      } else if ( this.key_walk_left ) {
        ch_horz = this.mario.canScrollLeft( 0 - Constants.CHAR_HORZ );
        bg_horz = (ch_horz > 0 - Constants.CHAR_HORZ) ? this.canScrollLeft(0 - Constants.CHAR_HORZ - ch_horz) : 0;
        dest_x = orig_x + ch_horz + bg_horz;
        // console.log("lt: " + dest_x + ", rt: " + (dest_x + this.mario.bounds.frameWidth));         
      }

      if (this.key_jump) {
        bg_vert = this.canScrollUp( Constants.CHAR_JUMP, Constants.CHAR_MAX_VERT );
        this.key_jump = bg_vert != 0;
      } else {
        bg_vert =  this.canScrollDown();
        ch_vert = ( bg_vert < Constants.GRAVITY ) ? this.mario.canScrollDown( Constants.GRAVITY ) : 0;  
        this.enable_jump = ( ch_vert + bg_vert ) == 0; 
      }
     
      let collided : BoundingBox[] = this.getCollisionObjects(this.mario, bg_vert, ch_vert, bg_horz, ch_horz);
      collided.forEach(element => {
        if (this.mario.collisionObjectId.includes( element.id )){
          if (this.mario.hasCollidedTop.includes( element.id )) {
            this.key_jump = false;  
            this.enable_jump = false;
            this.enable_left = true;
            this.enable_right = true;
            bg_vert = ch_vert = 0;
            // console.log("mario collided: top");
          } else if (this.mario.hasCollidedBottom.includes( element.id )) {
            this.platform_y = this.bounds.sourceY;
            this.enable_jump = true;
            this.enable_left = true;
            this.enable_right = true;
            bg_vert = ch_vert = 0;
            // console.log("mario collided: bottom");
          } else if (this.mario.hasCollidedRight.includes( element.id )) { 
            this.enable_right = false;
            bg_horz = ch_horz = 0;
            // console.log("mario collided: right");
          } else if (this.mario.hasCollidedLeft.includes( element.id )) {
            this.enable_left = false;
            bg_horz = ch_horz = 0;
            // console.log("mario collided: left");
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

      this.enemies.forEach(enemy => {
        en_vert = Constants.GRAVITY;
        en_horz = ( enemy.moveLeft ) ? 0 - Constants.ENEM_HORZ : Constants.ENEM_HORZ;

        let collided: BoundingBox[] = [];
        collided = this.getCollisionObjects(enemy, bg_vert, en_vert, bg_horz, en_horz);

        let collidedCount : number = 0; 
        collided.forEach(obj => {
          if (enemy.collisionObjectId.includes( obj.id )){
            if (enemy.hasCollidedBottom.includes( obj.id )) {
              en_vert = 0;
              // console.log("enemy collided: bottom");
            } else if (enemy.hasCollidedRight.includes( obj.id )) { 
              enemy.moveLeft = true;
              en_horz = ( enemy.moveLeft ) ? 0 - Constants.ENEM_HORZ : Constants.ENEM_HORZ;
              console.log("enemy collided: right");
            } else if (enemy.hasCollidedLeft.includes( obj.id )) {
              enemy.moveLeft = false;
              en_horz = ( enemy.moveLeft ) ? 0 - Constants.ENEM_HORZ : Constants.ENEM_HORZ;
              console.log("enemy collided: left");
            }
          }
          collidedCount++;
        });
        if (collidedCount < 1) en_horz = 0;

        enemy.update({
          bg_scroll_vert : 0-bg_vert
          , bg_scroll_horz : 0-bg_horz
          , char_scroll_vert : en_vert
          , char_scroll_horz : en_horz   
        });
        
        if ((enemy.getBounds().x + enemy.getBounds().frameWidth < this.bounds.x)){
          this.removeEnemy(enemy);
        }
      });//this.enemies.forEach...

      this.pipes.forEach(element => { element.update({vert : 0-bg_vert, scroll : 0-bg_horz}); });  
      this.blocks.forEach(element => { element.update({vert : 0-bg_vert, scroll : 0-bg_horz}); });
      this.terras.forEach(element => { element.update({vert : 0-bg_vert, scroll : 0-bg_horz}); });  

      this.bounds.sourceX += bg_horz;
      this.bounds.sourceY += bg_vert;
    };
  
    public renderFrame () {
      this.bounds.render();
      this.blocks.forEach(element => { element.render(); });
      //Do not render pipes! No images
      this.enemies.forEach(element => { element.render(); });
      this.mario.render();  
    };
  }