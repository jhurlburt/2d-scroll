import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output, HostListener } from '@angular/core';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { log, debuglog } from 'util';
import { renderComponent } from '@angular/core/src/render3';
import { maybeQueueResolutionOfComponentResources } from '@angular/core/src/metadata/resource_loading';
import { HOST_ATTR } from '@angular/platform-browser/src/dom/dom_renderer';

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37,
    SPACE = 32,
    CHAR_A = 65,
    CHAR_D = 68
}
export enum MARIO_ACTIONS {
    STAND_LEFT ,
    STAND_RIGHT,
    WALK_LEFT,
    WALK_RIGHT,
    JUMP_LEFT,
    JUMP_RIGHT,
    FALL_LEFT,
    FALL_RIGHT,
    FALL_DOWN,
    JUMP
}

const REFRESH_RATE: number = 1;
const CHAR_POSITION_X: number = 200;
const CHAR_POSITION_Y: number = 650;
// const MAX_MOMENTUM: number = 5;
const CHAR_WALK_SPEED: number = 2;
const CHAR_JUMP_SPEED: number = 4;
const CHAR_FALL_SPEED: number = 4;
const CHAR_HEIGHT: number = 64;
const CHAR_WIDTH: number = 64;
const CHAR_MAX_JUMP_HEIGHT : number = CHAR_HEIGHT * 5;
const CHAR_TICKS_PER_FRAME: number = 18;
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1200;
const PLATFORM_HEIGHT_1 = 483;
const MYSTERY_WIDTH = 61;
const MYSTERY_HEIGHT = 59;

@Component({
  selector: 'myCanvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
    @ViewChild('canvasE1') canvasE1: ElementRef<HTMLCanvasElement>;
    @ViewChild('imgMarioWalkingRight') imgMarioWalkRt: ElementRef<HTMLImageElement>;
    @ViewChild('imgMarioWalkingLeft') imgMarioWalkLt: ElementRef<HTMLImageElement>;
    @ViewChild('imgMarioStillLeft') imgMarioStillLt: ElementRef<HTMLImageElement>;
    @ViewChild('imgMarioStillRight') imgMarioStillRt: ElementRef<HTMLImageElement>;
    @ViewChild('imgMarioJumpRight') imgMarioJumpRt: ElementRef<HTMLImageElement>;
    @ViewChild('imgMarioJumpLeft') imgMarioJumpLt: ElementRef<HTMLImageElement>;
    @ViewChild('imgBackground1_1') imgBackground1_1: ElementRef<HTMLImageElement>;
    @ViewChild('imgBlock') imgBlock: ElementRef<HTMLImageElement>;
    
    key_walk_left: boolean = false;
    key_walk_right: boolean = false;
    key_jump: boolean = false;
    isdrawing = false;
    bg: Background;
    mario: Character;
    blocks: Array<Block>;

    constructor() { 
    }

    gameLoop(){
        console.log("gameLoop()");

        setInterval(() => {

            if (!this.isdrawing) {
                this.isdrawing = true;

                var scroll = 
                    (this.key_walk_right && this.bg.canScrollRight()) ? -1 :
                    (this.key_walk_left && this.bg.canScrollLeft()) ? 1 : 0
    
                //=-=-=- Update Objects =-=-=-//
                this.bg.update(scroll, this.key_jump, this.mario, this.blocks); 
                // this.mario.update(scroll, this.key_jump);
                // this.blocks.forEach(element => {
                //     element.update(scroll, this.key_jump);
                    
                // });

                // //=-=-=- Collision Detection =-=-=-//
                // var obj1 = this.mario.boundingBox;

                // this.blocks.forEach(element => {
                //     var obj2 = element.boundingBox;

                //     if (((obj1.x + obj1.frameWidth >= obj2.x) && (obj1.x + obj1.frameWidth <= obj2.x + obj2.x + obj2.frameWidth)) &&
                //         ((obj1.y + obj1.frameHeight >= obj2.y) && (obj1.y + obj1.frameHeight <= obj2.y + obj2.frameHeight))){
                //         console.log("Collision detected!");

                //         // if (this.key_jump) {                            
                //         //     // this.cancel_key_jump = true;
                //         // }
                //         // this.mario.update(scroll, this.key_jump);

                //     }                        
                // });

                //=-=-=- Render Objects =-=-=-//
                this.bg.render();
                this.mario.render();
                this.blocks.forEach(element => {
                    element.render();

                });
                this.isdrawing = false;                    
            }
            
        }, REFRESH_RATE);
        // window.requestAnimationFrame(this.gameLoop);
    }

    ngAfterViewInit() {    
        console.log("ngAfterViewInit()");

        this.canvasE1.nativeElement.height = CANVAS_HEIGHT;
        this.canvasE1.nativeElement.width = CANVAS_WIDTH;

        this.imgMarioStillLt.nativeElement.src = "assets/mario-still-left.png";
        this.imgMarioStillRt.nativeElement.src = "assets/mario-still-right.png";
        this.imgMarioWalkLt.nativeElement.src = "assets/mario-walking-left.png";
        this.imgMarioWalkRt.nativeElement.src = "assets/mario-walking-right.png";
        this.imgMarioJumpLt.nativeElement.src = "assets/mario-jump-left.png";
        this.imgMarioJumpRt.nativeElement.src = "assets/mario-jump-right.png";

        this.mario = new Character({
            context: this.canvasE1.nativeElement.getContext('2d'),
            images: [ 
                this.imgMarioStillLt.nativeElement,
                this.imgMarioStillRt.nativeElement,
                this.imgMarioWalkLt.nativeElement, 
                this.imgMarioWalkRt.nativeElement,
                this.imgMarioJumpLt.nativeElement,
                this.imgMarioJumpRt.nativeElement
             ],
            x: CHAR_POSITION_X,
            y: CHAR_POSITION_Y
        });

        this.imgBackground1_1.nativeElement.src = "assets/bg-1-1.png";

        this.bg = new Background({
            context: this.canvasE1.nativeElement.getContext('2d'),
            images: [ 
                this.imgBackground1_1.nativeElement
             ],
             sourceWidth: this.canvasE1.nativeElement.width,
             sourceHeight: this.canvasE1.nativeElement.height,
             frameWidth: this.canvasE1.nativeElement.width,
             frameHeight: this.canvasE1.nativeElement.height,
        });

        this.imgBlock.nativeElement.src = "assets/mystery-block.png";

        this.blocks =  [
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBlock.nativeElement
                ],                
                x: 913, //x: 913,
                y: PLATFORM_HEIGHT_1,
                sourceWidth: MYSTERY_WIDTH,
                sourceHeight: MYSTERY_HEIGHT,
                frameWidth: MYSTERY_WIDTH,
                frameHeight: MYSTERY_HEIGHT
            })
        ];

        // window.requestAnimationFrame(this.gameLoop);
        this.gameLoop();
    }

    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent){
        // console.log("window:keydown => %s", event.keyCode.toString());

        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D){
            this.key_walk_right = true;

        } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A){
            this.key_walk_left = true;

        } else if (event.keyCode == KEY_CODE.SPACE){
            this.key_jump = true;
        }
    }


    @HostListener('window:keyup', ['$event'])
    keyUpEvent(event: KeyboardEvent){

        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D){
            this.key_walk_right = false;

        } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A){
            this.key_walk_left = false;

        } else if (event.keyCode == KEY_CODE.SPACE){
            this.key_jump = false;
        }
    }
}

class Background {
    level1: Sprite;
    isFalling: boolean = false;
    helper: CharacterHelper;
    platform_y: number = 0;
    hasCollided: boolean = false;
    
    constructor(options){
        this.level1 = new Sprite({ 
            context:        options.context, 
            image:          options.images[0], 
            x:              options.x,
            y:              options.y,
            sourceWidth:    options.sourceWidth, 
            sourceHeight:   options.sourceHeight,
            frameWidth:     options.frameWidth, 
            frameHeight:    options.frameHeight,
            numberOfFrames: Math.trunc(options.images[0] / options.frameWidth)
        });
    }
    canScrollRight = function(){
        return (this.level1.sourceX < (this.level1.image.width - this.level1.frameWidth));
    };
    canScrollLeft = function(){
        return (this.level1.sourceX > 0);
    };  
    update = function(scroll: number, jump: boolean, mario: Character = null, blocks: Array<Block> = null){
        var vert = 0, 
            horz = 0,
            collisionIntersectX = 0,
            collisionIntersectY = 0;

        if (this.helper == null) this.helper = new CharacterHelper();
        var action = this.helper.getAction(mario.lastAction, scroll, jump);

        //HORIZONTAL SCROLLING
        if (((action == MARIO_ACTIONS.WALK_LEFT) || (action == MARIO_ACTIONS.JUMP_LEFT)) && ( scroll != 0 )) {
            horz = ((this.level1.sourceX - CHAR_WALK_SPEED) > 0) ? CHAR_WALK_SPEED : this.level1.sourceX;

        } else if ((action == MARIO_ACTIONS.WALK_RIGHT || action == MARIO_ACTIONS.JUMP_RIGHT) && (scroll != 0)) {            
            horz = 0 - CHAR_WALK_SPEED;
        }
        //VERTICAL SCROLLING
        if (mario.isJumping() && !this.isFalling) {
            var minimumY = this.platform_y - CHAR_MAX_JUMP_HEIGHT;
            vert = CHAR_JUMP_SPEED;
            if ((this.level1.sourceY + vert) < minimumY) {
                vert = Math.abs(minimumY) - Math.abs(this.level1.sourceY);
            }
        } else {
            var maximumY = this.platform_y;
            vert = 0 - CHAR_FALL_SPEED;
            if ((this.level1.sourceY - vert) > maximumY) {
                vert = Math.abs(this.level1.sourceY) - Math.abs(maximumY);
                this.isFalling = false;
            }
        }
        //Check for collisions, if collided then increase LVL Y
        blocks.forEach(element => {
            var obj1            = mario.boundingBox;
            var obj2            = element.boundingBox;
            var char_lt         = obj1.x;
            var char_rt         = obj1.x + obj1.frameWidth;                     
            var char_floor      = obj1.y;                     
            var char_ceiling    = obj1.y - obj1.frameHeight;
            var block_lt        = obj2.x + horz;                    //Predicted position
            var block_rt        = obj2.x + obj2.frameWidth + horz;  //Predicted position
            var block_floor     = obj2.y - vert;                    //Predicted position
            var block_ceiling   = obj2.y - obj2.frameHeight + vert; //Predicted position                
            
            //Assumption: If MARIO's HEAD intersecting with BLOCK floor then collision 
            //Assumption: If MARIO's FEET intersecting with BLOCK ceiling then collision 
            if ((char_ceiling < block_floor) && (char_ceiling > block_ceiling)){    //CHAR ascending to BLOCK
                collisionIntersectY = block_floor - char_ceiling; //Remove the overlap between the ceiling and floor

            } else if ((char_floor > block_ceiling) && (char_ceiling < block_floor)){    //CHAR descending to BLOCK
                collisionIntersectY = block_ceiling - char_floor; //Remove the overlap between the ceiling and floor
            }
            if ((char_rt > block_lt) && (char_lt < block_rt)) {
                collisionIntersectX = block_lt - char_rt;

            } else if ((char_lt < block_rt) && (char_rt > block_lt)) {
                collisionIntersectX = block_rt - char_lt;                
            }
        });

        if (vert < 0 && collisionIntersectY < 0) {
            if (collisionIntersectX != 0) {
                console.log("vert orig: " + vert);
                console.log("horz: " + horz);
                console.log("collisionIntersectX: " + collisionIntersectX);
                console.log("collisionIntersectY: " + collisionIntersectY);
                console.log("Descending and colliding with object: stop descent");
                vert -= collisionIntersectY;
                console.log("vert: " + vert);
                this.isFalling = false;
                this.platform_y = this.level1.sourceY -= vert;
            }
        
        }
        if (vert > 0 && collisionIntersectY > 0) {
            // console.log("horz: " + horz);
            // console.log("collisionIntersectX: " + collisionIntersectX);
            // console.log("collisionIntersectY: " + collisionIntersectY);

            if (collisionIntersectX != 0) {
                // console.log("Ascending and colliding with object: slow ascension");
                vert -= collisionIntersectY;
                this.isFalling = true;
            }
        }

        //UPDATE Background
        this.level1.sourceX -= horz; 
        this.level1.sourceY -= vert; 

        //Update MARIO SPRITE ANIMATION
        mario.update(action);

        // Update BLOCK
        blocks.forEach(element => {
            element.update(horz, vert, this.platformY);
        });
    };
    render = function(){
        this.level1.render();
    };
}

class Block {
    boundingBox:Sprite;
    lastAction: MARIO_ACTIONS.STAND_RIGHT;
    isFalling:  boolean = false;
    helper:     CharacterHelper;
    originalY:  number;
    // boundingBox: Sprite;
    platform_y: number;

    constructor (options){        
        this.boundingBox = new Sprite({ 
            context:        options.context, 
            image:          options.images[0], 
            x:              options.x, 
            y:              options.y,
            sourceWidth:    options.sourceWidth, 
            sourceHeight:   options.sourceHeight,
            frameWidth:     options.frameWidth,
            frameHeight:    options.frameHeight }); 
        this.originalY = options.y;
        // this.boundingBox = this.myBlock;
    }

    toString = function(){
        if (this.boundingBox != null){
            return this.boundingBox.toString();
        }
        return "";
    };
    update = function(hor: number, vert: number, platform_y: number){
        // this.boundingBox = this.myBlock;
        this.platform_y     = platform_y;
        this.boundingBox.x  += hor;
        this.boundingBox.y  += vert;
    };
    render = function(){
        this.boundingBox.render();
    };
}

class CharacterHelper {
    getAction = function(lastAction: MARIO_ACTIONS = MARIO_ACTIONS.STAND_RIGHT, scroll: number = 0, jump: boolean = false){

        if (jump && scroll > 0) {
            return MARIO_ACTIONS.JUMP_LEFT;
        
        } else if (jump && scroll < 0) {
            return MARIO_ACTIONS.JUMP_RIGHT;

        } else if (jump  && scroll == 0) {
            if (lastAction == MARIO_ACTIONS.WALK_LEFT || lastAction == MARIO_ACTIONS.JUMP_LEFT || lastAction == MARIO_ACTIONS.STAND_LEFT){
                return MARIO_ACTIONS.JUMP_LEFT;
            } else {
                return MARIO_ACTIONS.JUMP_RIGHT;
            }
        } else if (scroll > 0) {
            return MARIO_ACTIONS.WALK_LEFT;

        } else if (scroll < 0) {
            return MARIO_ACTIONS.WALK_RIGHT;

        } else if (scroll == 0) {
            if (lastAction == MARIO_ACTIONS.WALK_LEFT || lastAction == MARIO_ACTIONS.JUMP_LEFT || lastAction == MARIO_ACTIONS.STAND_LEFT){
                return MARIO_ACTIONS.STAND_LEFT;
            } else {
                return MARIO_ACTIONS.STAND_RIGHT;
            }
        }
    };

    detectCollision = function(char: Character, blocks: Block[]){

        //=-=-=- Collision Detection =-=-=-//
        if (char != null){
            var obj1: Sprite = char.boundingBox;

            blocks.forEach(element => {
                var obj2 = element.boundingBox;
                if ((( obj1.x + obj1.frameWidth > obj2.x) && 
                      (obj1.x < obj2.x + obj2.frameWidth)) &&
                    (( obj1.y - obj1.frameHeight < obj2.y) &&
                      (obj1.y - obj1.frameHeight > obj2.y - obj2.frameHeight))){
                    
                        console.log("Collision detected!");
                        console.log("mario => " + obj1.toString());
                        console.log("block => " + obj2.toString());

                        return true;    
                }                        
            });        
        }
    };
}

class Character {
    mario_still_lt: Sprite;
    mario_still_rt: Sprite;
    mario_walk_lt:  Sprite;
    mario_walk_rt:  Sprite;
    mario_jump_lt:  Sprite;
    mario_jump_rt:  Sprite;
    boundingBox: Sprite;
    lastAction: MARIO_ACTIONS = MARIO_ACTIONS.STAND_RIGHT;

    constructor(options){
        this.mario_still_lt = new Sprite({ context: options.context, image: options.images[0], x: options.x, y: options.y,
            sourceWidth:    options.sourceWidth, 
            sourceHeight:   options.sourceHeight,
            frameWidth:     options.frameWidth,
            frameHeight:    options.frameHeight });            
        this.mario_still_rt = new Sprite({ context: options.context, image: options.images[1], x: options.x, y: options.y,
            sourceWidth:    options.sourceWidth, 
            sourceHeight:   options.sourceHeight,
            frameWidth:     options.frameWidth,
            frameHeight:    options.frameHeight });
        this.mario_walk_lt  = new Sprite({ context: options.context, image: options.images[2], x: options.x, y: options.y,
            ticksPerFrame:  CHAR_TICKS_PER_FRAME, 
            sourceWidth:    options.sourceWidth     || CHAR_WIDTH, 
            sourceHeight:   options.sourceHeight    || CHAR_HEIGHT,
            frameWidth:     options.frameWidth      || CHAR_WIDTH,
            frameHeight:    options.frameHeight     || CHAR_HEIGHT });
        this.mario_walk_rt  = new Sprite({ context: options.context, image: options.images[3], x: options.x, y: options.y,
            ticksPerFrame:  CHAR_TICKS_PER_FRAME, 
            sourceWidth:    options.sourceWidth     || CHAR_WIDTH, 
            sourceHeight:   options.sourceHeight    || CHAR_HEIGHT,
            frameWidth:     options.frameWidth      || CHAR_WIDTH,
            frameHeight:    options.frameHeight     || CHAR_HEIGHT });
        this.mario_jump_lt  = new Sprite({ context: options.context, image: options.images[4], x: options.x, y: options.y,
            sourceWidth:    options.sourceWidth, 
            sourceHeight:   options.sourceHeight,
            frameWidth:     options.frameWidth,
            frameHeight:    options.frameHeight });
        this.mario_jump_rt  = new Sprite({ context: options.context, image: options.images[5], x: options.x, y: options.y,
            sourceWidth:    options.sourceWidth, 
            sourceHeight:   options.sourceHeight,
            frameWidth:     options.frameWidth,
            frameHeight:    options.frameHeight });
        this.boundingBox = this.mario_still_rt;
    }

    toString = function(){
        if (this.boundingBox != null){
            return this.boundingBox.toString();
        }
        return "";
    };

    isJumping = function() {
        return (this.lastAction == MARIO_ACTIONS.JUMP_LEFT || 
            this.lastAction == MARIO_ACTIONS.JUMP_RIGHT || 
            this.lastAction == MARIO_ACTIONS.JUMP);
    };

    update = function(action: MARIO_ACTIONS = MARIO_ACTIONS.STAND_RIGHT){
        switch (action){
            case MARIO_ACTIONS.WALK_LEFT: {
                this.boundingBox = this.mario_walk_lt;
                break;
            } case MARIO_ACTIONS.WALK_RIGHT: {
                this.boundingBox = this.mario_walk_rt;
                break;
            } case MARIO_ACTIONS.STAND_LEFT: {
                this.boundingBox = this.mario_still_lt;
                break;
            } case MARIO_ACTIONS.STAND_RIGHT: {
                this.boundingBox = this.mario_still_rt;
                break;
            } case MARIO_ACTIONS.JUMP_LEFT: {
                this.boundingBox = this.mario_jump_lt;
                break;
            } case MARIO_ACTIONS.JUMP_RIGHT: {
                this.boundingBox = this.mario_jump_rt;
                break;
            } case MARIO_ACTIONS.JUMP: {
                this.boundingBox = (this.lastAction == MARIO_ACTIONS.STAND_LEFT) ? this.mario_jump_lt : this.mario_jump_rt;
                break;
            } default: {
                console.log("switch (action) == default");
                break;
            }
        }
        this.lastAction = action;
        this.boundingBox.update();
    };
    render = function(){
        this.boundingBox.render();
    };
}

class Sprite {
    context:        CanvasRenderingContext2D;
    image:          HTMLImageElement;
    numberOfFrames: number = 1;
    frameIndex:     number = 0;
    ticksPerFrame:  number = 0;
    tickCount:      number = 0;
    x:              number = 0;
    y:              number = 0;
    frameWidth:     number = 0;
    frameHeight:    number = 0;
    sourceWidth:    number = 0;
    sourceHeight:   number = 0;
    sourceX:        number = 0;
    sourceY:        number = 0;

    constructor (options){
        this.ticksPerFrame = options.ticksPerFrame || 0;
        this.context = options.context;
        this.image = options.image;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.frameWidth = options.frameWidth || options.image.width;
        this.frameHeight = options.frameHeight || options.image.height;
        this.sourceWidth = options.sourceWidth || options.image.width;
        this.sourceHeight = options.sourceHeight || options.image.height;
        this.numberOfFrames = options.numberOfFrames || Math.trunc(options.image.width / options.frameWidth);
    }
    toString = function() {
        return "this.x: " + this.x + ", this.y: " + this.y + 
            ", this.frameWidth: " + this.frameWidth + ", this.frameHeight: " + this.frameHeight + 
            ", this.sourceWidth: " + this.sourceWidth + ", this.sourceHeight: " + this.sourceHeight;
    };
    update = function () {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;            
            // If the current frame index is in range
            if (this.frameIndex < this.numberOfFrames - 1) {	
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        } 
        this.sourceX = this.frameIndex * this.frameWidth;
    };
    render = function () {
        this.context.drawImage(
          this.image,         // img  Source image object	Sprite sheet
          this.sourceX,       // sx	Source x	Frame index times frame width
          this.sourceY,       // sy	Source y	0
          this.sourceWidth,   // sw	Source width	Frame width
          this.sourceHeight,  // sh	Source height	Frame height 
          this.x,             // dx	Destination x	0
          this.y,             // dy	Destination y	0
          this.frameWidth,    // dw	Destination width	Frame width
          this.frameHeight);  // dh	Destination height	Frame height
    };      
}