import { Helper } from '../helpers/Helper';
import { Constants } from '../helpers/Constants';
import { Character } from './Character';
import { BoundingBox } from '../interface/BoundingBox'; 
import { KEY_CODE } from '../helpers/Keyboard';
import { Enemy } from './Enemy';
import { Block } from './Block';
import { Terra } from './Terra';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Pipe } from './Pipe';

// const GRAVITY: number = (600 / 1000); //TODO: changing this to 3 breaks the mario stand action
const CHECKPOINT_BG_X: number = 1000;
const CHECKPOINT_ENEMY_DROP_X: number = 600;
const CHECKPOINT_ENEMY_DROP_Y: number = 0;

export class Level {
  // private bounds: Sprite2;
  private mario: Character;
  private enemies: Enemy[];
  private terras: Terra[];
  private blocks: Block[];
  private pipes: Pipe[];
  private key_walk_left: boolean = false;
  private key_walk_right: boolean = false;
  private key_jump: boolean = false;
  private enable_left: boolean = true;
  private enable_right: boolean = true;
  private enable_jump: boolean = true;
  private platform_y: number = 0;
  private historyLog : string[] = [];
  private width: number = 0;
  private height: number = 0;
  private frameWidth: number = 0;
  private frameHeight: number = 0;
  private sourceX: number = 0;
  private sourceY: number = 0;
  private image: HTMLImageElement;
  private context: CanvasRenderingContext2D;
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;
  private x: number = 0;
  private y: number = 0;
  private previousTime: number = 0;
  private currentTime: number = Date.now();
  private deltaTime: number = 0;
  private _endTurn: boolean = false;

  constructor( options ) {
    this.context = options.context || null;
    this.image = options.image || null; 
    // this.x = options.x || 0;
    // this.y = options.y || 0;
    this.width = options.width || options.image.width;
    this.height = options.height || options.image.height;
    this.frameWidth = options.frameWidth || options.image.width;
    this.frameHeight = options.frameHeight || options.image.height;
    this.sourceWidth = options.sourceWidth || options.image.width;
    this.sourceHeight = options.sourceHeight || options.image.height;
    this.mario  = options.character;
    this.terras = [];
    this.enemies = [];
    this.pipes  = [];
    this.blocks = []; 
    this.previousTime = Date.now();
  }

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  private canScrollRight (scroll: number) {
    let rightEdge = this.width - this.frameWidth;
    return this.sourceX + scroll > rightEdge ? rightEdge - this.sourceX : scroll;
  };

  private canScrollLeft (scroll: number = 0) {
    let leftEdge = 0;
    return this.sourceX + scroll < leftEdge ? leftEdge - this.sourceX : scroll;
  };

  // private canScrollUp (vert: number = Character.JUMP,  max: number = Character.MAX_VERT) {
  //   let topEdge = this.platform_y - max; //-1, -10, -100, -200
  //   return this.sourceY + vert < topEdge ? topEdge - this.sourceY : vert;
  // }; 

  // private canScrollDown (vert: number = Constants.GRAVITY) {
  //   var bottomEdge = this.platform_y;
  //   return this.sourceY + vert > bottomEdge ? this.sourceY - bottomEdge : vert; //-1
  // };

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
        this.enable_jump = false;
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

  private reset(){
    if (!this.key_jump) this.platform_y = 0; //reset platform
    this.mario.resetCollided();      
    this.terras.forEach( element => { element.resetCollided(); });
    this.enemies.forEach( element => { element.resetCollided(); });
    this.blocks.forEach( element => { element.resetCollided(); });
    this.pipes.forEach( element => { element.resetCollided(); });
  }

  private getCollisions(boundObj: BoundingBox, canvas_move_y: number = 0, mario_move_y: number = 0, canvas_move_x: number = 0, character_move_x: number = 0){
    let collided: BoundingBox[] = [];

    this.pipes.forEach(element => {
      if (Helper.detectCollisionList(boundObj, [ element ], canvas_move_y, mario_move_y, canvas_move_x, character_move_x)){
        collided.push( element ); 
        console.debug('pipe collided: ' + element.id);
      }
    });
    this.blocks.forEach(element => {
      if (Helper.detectCollisionList(boundObj, [ element ], canvas_move_y, mario_move_y, canvas_move_x, character_move_x)) { 
        collided.push( element ); 
        console.debug('block collided: ' + element.id);
      }
    });    
    this.terras.forEach(element => {
      if (Helper.detectCollisionList(boundObj, [ element ], canvas_move_y, mario_move_y, canvas_move_x, character_move_x)) { 
        collided.push( element ); 
        console.debug('terra collided: ' + element.id);
      }
    });
    return collided;
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

  public addPipes (pipes : Pipe []){
    pipes.forEach(pipe => {
      this.addPipe(pipe);        
    });
  }

  private addPipe(pipe : Pipe){
    this.pipes.push(pipe);
  }

  private removePipe (pipe : Pipe){      
    const index = this.pipes.indexOf(pipe, 0);
    if (index > -1) {
      this.pipes.splice(index, 1);
    }
  }

  get endTurn(): boolean {
    return this._endTurn;
  }

  set endTurn(value: boolean) {
    this._endTurn = value;
    // return this.mario.animateDeath();
  }

  public update () {
    let canvas_distance_y: number = 0, canvas_distance_x: number = 0; 
    let mario_distance_y: number = 0, mario_distance_x: number = 0;
    //RESET COLLISIONS
    this.reset();

    this.currentTime = Date.now();
    this.deltaTime = (this.currentTime - this.previousTime) / 1000; //MILLISECONDS
    this.previousTime = this.currentTime;

    //DISTANCE = VELOCITY * TIME
    this.mario.velocity_x = this.mario.speed - this.mario.gravity;
    mario_distance_x = 
      ( this.key_walk_right ) ? (this.mario.velocity_x) * this.deltaTime: 
      ( this.key_walk_left ) ? 0 - ((this.mario.velocity_x) * this.deltaTime): 0;

    this.mario.velocity_y = (this.key_jump) ? (this.mario.gravity - this.mario.speed) : this.mario.gravity;
    mario_distance_y = this.mario.velocity_y * this.deltaTime;

    //CHARACTER COLLISION DETECTION
    let collided : BoundingBox[] = this.getCollisions(this.mario, canvas_distance_y, mario_distance_y, canvas_distance_x, mario_distance_x);
    collided.forEach(element => {
      if (element.collisionObjectId.includes( this.mario.id )){
        if (element.hasCollidedBottom.includes( this.mario.id )) {
          this.key_jump = false;  
          this.enable_jump = false; 
          this.enable_left = true;
          this.enable_right = true;

        } else if (element.hasCollidedTop.includes( this.mario.id )) { //mario has/or will collide with the object's top surface
          var element_top = element.getBounds().y; // - element.getBounds().frameHeight; //get object's top position (y - height)
          var mario_bottom = this.mario.getBounds().y + this.mario.getBounds().frameHeight;
          mario_distance_y = element_top - mario_bottom; //set mario's bottom position to (object top - 1)
          this.platform_y = this.sourceY + canvas_distance_y; // - (element_top - mario_bottom);
          this.enable_jump = true;
          this.enable_left = true;
          this.enable_right = true;

        } else if (element.hasCollidedLeft.includes( this.mario.id )) { 
          this.enable_right = false;
          mario_distance_x = 0;

        } else if (element.hasCollidedRight.includes( this.mario.id )) {
          this.enable_left = false;
          mario_distance_x = 0;
        }
      }
    });     

    if (mario_distance_x > 0){
      mario_distance_x = this.mario.canScrollRight( mario_distance_x );
      if (mario_distance_x == 0){ console.debug("can scroll right? no. fucking. way") }
      canvas_distance_x = (mario_distance_x < (this.mario.velocity_x * this.deltaTime)) ? (this.canScrollRight((this.mario.velocity_x * this.deltaTime) - mario_distance_x)) : 0;

    } else if (mario_distance_x < 0){
      mario_distance_x = this.mario.canScrollLeft( mario_distance_x );
      canvas_distance_x = (mario_distance_x > (0 - (this.mario.velocity_x * this.deltaTime))) ? (this.canScrollLeft(0 - (this.mario.velocity_x * this.deltaTime) - mario_distance_x)) : 0;
    }
    //UPDATE ENEMIES
    this.enemies.forEach(enemy => {
      let enemy_y = enemy.gravity * this.deltaTime;
      let enemy_x = ( enemy.moveLeft ) ? 0 - ((enemy.speed - enemy.gravity) * this.deltaTime) : ((enemy.speed - enemy.gravity) * this.deltaTime);

      let collided: BoundingBox[] = this.getCollisions(enemy, canvas_distance_y, enemy_y, canvas_distance_x, enemy_x);
      collided.forEach(element => {
        if (element.collisionObjectId.includes( enemy.id )) {
          if (element.hasCollidedTop.includes( enemy.id )) {            
            enemy_y = 0;
          } else if (element.hasCollidedLeft.includes( enemy.id )) { 
            enemy.moveLeft = true;
            enemy_x = ( enemy.moveLeft ) ? (0 - ((enemy.speed - enemy.gravity) * this.deltaTime)) : ((enemy.speed - enemy.gravity) * this.deltaTime);
          } else if (element.hasCollidedRight.includes( enemy.id )) {
            enemy.moveLeft = false;
            enemy_x = ( enemy.moveLeft ) ? (0 - ((enemy.speed - enemy.gravity) * this.deltaTime)) : ((enemy.speed - enemy.gravity) * this.deltaTime);
          }
        }
      });
      if (collided.length < 1) enemy_x = 0;

      //Character and enemy occupy the same space
      if (Helper.enemyCollided(this.mario, enemy)){          
        this.mario.collisionObjectId.push( enemy.id );

        //If char bt is 0 -> 20% below enemy tp
        let orig_top=this.mario.getBounds().y-this.mario.getBounds().frameHeight, 
            orig_bot=this.mario.getBounds().y, 
            orig_rt=this.mario.getBounds().x+this.mario.getBounds().frameWidth, 
            orig_lt=this.mario.getBounds().x;

        let block_top = enemy.getBounds().y-enemy.getBounds().frameHeight, 
            block_bot = enemy.getBounds().y, 
            block_rt = enemy.getBounds().x+enemy.getBounds().frameWidth, 
            block_lt = enemy.getBounds().x;
          
        if ((orig_top < block_top) && (orig_bot < block_top + enemy.getBounds().frameHeight * .2)) {
          console.log("Collide top")
          if ((orig_lt < block_rt) && (orig_rt > block_lt + enemy.getBounds().frameWidth * .5)) {
            //If char rt is 50 -> 100% right of enemy lt
            console.log("Collide left")
            //Animate enemy death then remove from level
            enemy.isTerminated = true;
          } else if ((orig_rt > block_lt) && (orig_lt < block_rt - enemy.getBounds().frameWidth * .5)) {
            //If char lt is 50 -> 100% left of enemy right
            console.log("Collide left")
            //Animate enemy death then remove from level
            enemy.isTerminated = true;
          } else {
            this.mario.isTerminated = true;
            this.notifyParent.emit({ name : "Termination" });
          }
        } else {
          this.mario.isTerminated = true;
          this.notifyParent.emit({ name : "Termination" });
        }
      }
      enemy.update({
        bg_scroll_vert : 0-canvas_distance_y
        , bg_scroll_horz : 0-canvas_distance_x
        , char_scroll_vert : enemy_y
        , char_scroll_horz : enemy_x   
      });
      if ((enemy.getBounds().x + enemy.getBounds().frameWidth) < 0){
        this.removeEnemy(enemy);
      }
    });//this.enemies.forEach...

    // if (!this._endTurn){
    //UPDATE CHARACTER
    this.mario.update({ bg_scroll_vert: canvas_distance_y, bg_scroll_horz: canvas_distance_x, char_scroll_vert: mario_distance_y, char_scroll_horz: mario_distance_x });
  
    //UPDATE STATIC OBJECTS
    this.pipes.forEach(element => { element.update({vert : 0-canvas_distance_y, scroll : 0-canvas_distance_x}); });
    this.blocks.forEach(element =>{ element.update({vert : 0-canvas_distance_y, scroll : 0-canvas_distance_x}); });
    this.terras.forEach(element =>{ element.update({vert : 0-canvas_distance_y, scroll : 0-canvas_distance_x}); });  

    //UPDATE BOUNDS X/Y
    this.sourceX += canvas_distance_x;
    this.sourceY += canvas_distance_y;
    // }
  };

  public checkpointLogic(){
    //CHECKPOINT LOGIC
    let mario_x = this.mario.getBounds().x; 
    let orig_x = mario_x + this.sourceX;
    let enemy_x = mario_x + CHECKPOINT_ENEMY_DROP_X;
    let enemy_y = CHECKPOINT_ENEMY_DROP_Y;
    let count = (orig_x - (orig_x % CHECKPOINT_BG_X)) / CHECKPOINT_BG_X;

  if (!this.historyLog.includes("Checkpoint" + count)){
      this.historyLog.push("Checkpoint" + count);
      this.notifyParent.emit({ name : "Checkpoint", x : enemy_x, y : enemy_y, moveLeft : (count % 2) == 0 });
    }
  }

  public render () { 

    this.context.drawImage(
      this.image,         // img  Source image object	Sprite sheet
      this.sourceX,       // x coordinate within the image. greater than 0 and less than sourcewidth. default: 0
      this.sourceY,       // y coordinate within the image. greater than 0 and less than sourceheight. default: 0
      this.sourceWidth,   // width of the image being displayed on the canvas, greater than 0 and less than image width. default: canvas width
      this.sourceHeight,  // height of the image being displayed on the canvas, greater than 0 and less than image height. default: canvas height
      this.x,             // x coordinate of the canvas where the image will be displayed. can be greater than 0 and less than canvas width. default: 0 
      this.y,             // y coordinate of the canvas where the image will be displayed. can be greater than 0 and less than canvas height. default: 0
      this.frameWidth,    // dw	Destination width	Frame width
      this.frameHeight);  // dh	Destination height	Frame height

    // this.render();
    this.terras.forEach(element => { element.render( this.x, this.y, this.frameWidth, this.frameHeight ); });
    this.blocks.forEach(element => { element.render( this.x, this.y, this.frameWidth, this.frameHeight ); });
    this.pipes.forEach(element => { element.render( this.x, this.y, this.frameWidth, this.frameHeight ); });
    this.enemies.forEach(element => { element.render( this.x, this.y, this.frameWidth, this.frameHeight ); });
    this.mario.render( this.x, this.y, this.frameWidth, this.frameHeight );  
  };
}