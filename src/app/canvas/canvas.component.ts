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
export enum ACTION {
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

const REFRESH: number = 1;
const POSITION_X: number = 200;
const POSITION_Y: number = 650;
const WALK_SPEED: number = 2;
const JUMP_SPEED: number = 4;
const FALL_SPEED: number = 4;
const HEIGHT: number = 64;
const WIDTH: number = 64;
const MAX_JUMP : number = HEIGHT * 5;
const TPF: number = 18;
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1200;
const PLATFORM_HEIGHT_1 = 484;
const PLATFORM_HEIGHT_2 = PLATFORM_HEIGHT_1 - 228;
const MYSTERY_WIDTH = 58;
const MYSTERY_HEIGHT = 58;

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
    @ViewChild('imgBrick') imgBrick: ElementRef<HTMLImageElement>;
    
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

                // var scroll = 
                //     (this.key_walk_right && this.bg.canScrollRight()) ? -1 :
                //     (this.key_walk_left && this.bg.canScrollLeft()) ? 1 : 0

                var scroll = 
                    (this.key_walk_right)   ?  this.bg.canScrollRight() :
                    (this.key_walk_left)    ?  this.bg.canScrollLeft() : 0;

                // var vert = 
                //     (this.key_jump) ? this.bg.canScrollUp() :
                //     (this.bg.isFalling) ? this.bg.canScrollDown() : 0;

                var vert = 
                    (this.mario.isFalling)  ? this.bg.canScrollDown() :
                    (this.key_jump)         ? this.bg.canScrollUp() : 0;

                    //=-=-=- Update Objects =-=-=-//
                this.bg.update(scroll, vert, this.mario, this.blocks); 
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
            
        }, REFRESH);
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
            x: POSITION_X,
            y: POSITION_Y
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
        this.imgBrick.nativeElement.src = "assets/brick-block.png";

        this.blocks =  [
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBlock.nativeElement
                ],                
                x: 914, //x: 913,
                y: PLATFORM_HEIGHT_1,
                sourceWidth: MYSTERY_WIDTH,
                sourceHeight: MYSTERY_HEIGHT,
                frameWidth: MYSTERY_WIDTH,
                frameHeight: MYSTERY_HEIGHT
            }),
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBrick.nativeElement
                ],                
                x: 1141, //x: 913,
                y: PLATFORM_HEIGHT_1,
                sourceWidth: MYSTERY_WIDTH,
                sourceHeight: MYSTERY_HEIGHT,
                frameWidth: MYSTERY_WIDTH,
                frameHeight: MYSTERY_HEIGHT
            }),
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBlock.nativeElement
                ],                
                x: 1141 + MYSTERY_WIDTH, //x: 913,
                y: PLATFORM_HEIGHT_1,
                sourceWidth: MYSTERY_WIDTH,
                sourceHeight: MYSTERY_HEIGHT,
                frameWidth: MYSTERY_WIDTH,
                frameHeight: MYSTERY_HEIGHT
            }),
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBrick.nativeElement
                ],                
                x: 1141 + MYSTERY_WIDTH * 2, //x: 913,
                y: PLATFORM_HEIGHT_1,
                sourceWidth: MYSTERY_WIDTH,
                sourceHeight: MYSTERY_HEIGHT,
                frameWidth: MYSTERY_WIDTH,
                frameHeight: MYSTERY_HEIGHT
            }),
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBlock.nativeElement
                ],                
                x: 1141 + MYSTERY_WIDTH * 3, //x: 913,
                y: PLATFORM_HEIGHT_1,
                sourceWidth: MYSTERY_WIDTH,
                sourceHeight: MYSTERY_HEIGHT,
                frameWidth: MYSTERY_WIDTH,
                frameHeight: MYSTERY_HEIGHT
            }),
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBrick.nativeElement
                ],                
                x: 1141 + MYSTERY_WIDTH * 4, //x: 913,
                y: PLATFORM_HEIGHT_1,
                sourceWidth: MYSTERY_WIDTH,
                sourceHeight: MYSTERY_HEIGHT,
                frameWidth: MYSTERY_WIDTH,
                frameHeight: MYSTERY_HEIGHT
            }),
            new Block({
                context: this.canvasE1.nativeElement.getContext('2d'),
                images: [
                    this.imgBlock.nativeElement
                ],                
                x: 1141 + MYSTERY_WIDTH * 2, //x: 913,
                y: PLATFORM_HEIGHT_2,
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
    // isFalling: boolean = false;
    helper: Helper;
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
        // return (this.level1.sourceX < (this.level1.image.width - this.level1.frameWidth));
        var rightEdge = this.level1.image.width - this.level1.frameWidth;
        return this.level1.sourceX + WALK_SPEED > rightEdge ? 
            rightEdge - this.level1.sourceX : 
            WALK_SPEED;
    };
    canScrollLeft = function(){
        // return this.level1.sourceX > 0; 
        var leftEdge = 0;
        return WALK_SPEED > this.level1.sourceX ? leftEdge - this.level1.sourceX : 0-WALK_SPEED; 
    };
    canScrollUp = function(){
        var topEdge = this.platformY + MAX_JUMP;
        return this.level1.sourceY + JUMP_SPEED > topEdge ? 
            this.level1.sourceY - topEdge:
            0-JUMP_SPEED;
    };
    canScrollDown = function(){
        var bottomEdge = this.platformY;
        return this.level1.sourceY + FALL_SPEED > bottomEdge ? this.level1.sourceY - bottomEdge : FALL_SPEED;
    };
    update = function(scroll: number, vert: number, mario: Character = null, blocks: Array<Block> = null){
        var collisionX = 0,
            collisionY = 0,
            originalY = this.level1.sourceY,
            originalX = this.level1.sourceX,
            action: ACTION;

        if (this.helper == null) this.helper = new Helper();
        action = this.helper.getAction(mario.lastAction, scroll, vert);

        //Update MARIO SPRITE ANIMATION
        mario.update(action);

        //MARIO CAN BE: STANDING, JUMPING, FALLING
        this.level1.sourceX += scroll;
        this.level1.sourceY += vert;
        blocks.forEach(element => {
            //FG elements should move opposite the BG element            
            element.update(0-scroll, 0-vert, this.platformY);
        });

        //VERTICAL SCROLLING
        if (mario.isJumping()) {
            // var minimumY = this.platform_y - MAX_JUMP;            
            // this.level1.sourceY -= JUMP_SPEED;            
            // if (this.level1.sourceY < minimumY) {
            //     this.level1.sourceY = minimumY;
            //     mario.isFalling = true;
            // } else {
            //     blocks.forEach(element => {
            //         element.update(0, 2, this.platformY);
            //     });    
            // }
        } else {
            // var maximumY = this.platform_y;
            // var maximumY = 0;

            // if (this.level1.sourceY > maximumY) {
            //     this.level1.sourceY = maximumY;
            //     mario.isFalling = false; //Stop falling

            // } else {
            //     //Continue falling
            //     this.level1.sourceY += FALL_SPEED;
            //     blocks.forEach(element => {
            //         element.update(0, 0+FALL_SPEED, this.platformY);
            //     });    
            // }
        }
        //Check for collisions, if collided then increase LVL Y
        // blocks.forEach(element => {
        //     var obj1            = mario.boundingBox;
        //     var obj2            = element.boundingBox;
        //     var char_lt         = obj1.x;
        //     var char_rt         = obj1.x + obj1.frameWidth;                     
        //     var char_floor      = obj1.y;                     
        //     var char_ceiling    = obj1.y - obj1.frameHeight;
        //     var block_lt        = obj2.x;                    //Predicted position
        //     var block_rt        = obj2.x + obj2.frameWidth;  //Predicted position
        //     var block_floor     = obj2.y;                    //Predicted position
        //     var block_ceiling   = obj2.y - obj2.frameHeight; //Predicted position
            
        //     //Assumption: If MARIO's HEAD intersecting with BLOCK floor then collision 
        //     //Assumption: If MARIO's FEET intersecting with BLOCK ceiling then collision 
        //     if ((char_ceiling <= block_floor) && (char_floor > block_floor)){    //CHAR ascending to BLOCK
        //         //Assumption: collisionIntersectY > 0
        //         // collisionY = block_floor - char_ceiling; //Remove the overlap between the ceiling and floor
        //         mario.isFalling = true; 

        //     } else if ((char_floor >= block_ceiling) && (char_ceiling < block_ceiling)){    //CHAR descending to BLOCK
        //         //Assumption: collisionIntersectY < 0 
        //         // collisionY = block_ceiling - char_floor; //Remove the overlap between the ceiling and floor
        //         //block_ceiling:648,char_floor:650
        //         mario.isFalling = false; 
        //         this.platform_y = this.level1.sourceY; //Terr Firma!!!
        //         // console.log("block_ceiling:" + block_ceiling + ",char_floor:" + char_floor);
        //     }
        // });
    };
    render = function(){
        this.level1.render();
    };
}

class Block {
    boundingBox:Sprite;
    lastAction: ACTION.STAND_RIGHT;
    // isFalling:  boolean = false;
    // helper:     Helper;
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

class Helper {
    getAction = function(lastAction: ACTION = ACTION.STAND_RIGHT, scroll: number = 0, vert: number = 0){

        if (vert < 0 && scroll < 0) {
            return ACTION.JUMP_LEFT;
        
        } else if (vert < 0 && scroll > 0) {
            return ACTION.JUMP_RIGHT;

        } else if (vert < 0 && scroll == 0) {
            if (lastAction == ACTION.WALK_LEFT || lastAction == ACTION.JUMP_LEFT || lastAction == ACTION.STAND_LEFT){
                return ACTION.JUMP_LEFT;
            } else {
                return ACTION.JUMP_RIGHT;
            }
        } else if (scroll < 0) {
            return ACTION.WALK_LEFT;

        } else if (scroll > 0) {
            return ACTION.WALK_RIGHT;

        } else if (scroll == 0) {
            if (lastAction == ACTION.WALK_LEFT || lastAction == ACTION.JUMP_LEFT || lastAction == ACTION.STAND_LEFT){
                return ACTION.STAND_LEFT;
            } else {
                return ACTION.STAND_RIGHT;
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
    lastAction: ACTION = ACTION.STAND_RIGHT;
    isFalling: boolean = false;

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
            ticksPerFrame:  TPF, 
            sourceWidth:    options.sourceWidth     || WIDTH, 
            sourceHeight:   options.sourceHeight    || HEIGHT,
            frameWidth:     options.frameWidth      || WIDTH,
            frameHeight:    options.frameHeight     || HEIGHT });
        this.mario_walk_rt  = new Sprite({ context: options.context, image: options.images[3], x: options.x, y: options.y,
            ticksPerFrame:  TPF, 
            sourceWidth:    options.sourceWidth     || WIDTH, 
            sourceHeight:   options.sourceHeight    || HEIGHT,
            frameWidth:     options.frameWidth      || WIDTH,
            frameHeight:    options.frameHeight     || HEIGHT });
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
        return (this.lastAction == ACTION.JUMP_LEFT || 
            this.lastAction == ACTION.JUMP_RIGHT || 
            this.lastAction == ACTION.JUMP) && !this.isFalling;
    };

    update = function(action: ACTION = ACTION.STAND_RIGHT){
        switch (action){
            case ACTION.WALK_LEFT: {
                this.boundingBox = this.mario_walk_lt;
                break;
            } case ACTION.WALK_RIGHT: {
                this.boundingBox = this.mario_walk_rt;
                break;
            } case ACTION.STAND_LEFT: {
                this.boundingBox = this.mario_still_lt;
                break;
            } case ACTION.STAND_RIGHT: {
                this.boundingBox = this.mario_still_rt;
                break;
            } case ACTION.JUMP_LEFT: {
                this.boundingBox = this.mario_jump_lt;
                break;
            } case ACTION.JUMP_RIGHT: {
                this.boundingBox = this.mario_jump_rt;
                break;
            } case ACTION.JUMP: {
                this.boundingBox = (this.lastAction == ACTION.STAND_LEFT) ? this.mario_jump_lt : this.mario_jump_rt;
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