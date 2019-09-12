import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output, HostListener } from '@angular/core';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { log, debuglog } from 'util';
import { renderComponent } from '@angular/core/src/render3';

const MARIO_POSITION_X: number = 200;
const MARIO_POSITION_Y: number = 650;
const MAX_MOMENTUM: number = 5;
const REFRESH_RATE: number = 1;
const MARIO_WALK_SPEED: number = 2;
const MARIO_JUMP_SPEED: number = 4;
const MARIO_FALL_SPEED: number = 4;
const FRAME_HEIGHT: number = 64;
const FRAME_WIDTH: number = 64;
const MARIO_MAX_JUMP_HEIGHT : number = 0 - (FRAME_HEIGHT * 5);
const MARIO_TICKS_PER_FRAME: number = 18;
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1200;

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
    mario: Character;
    bg: Background;
    blocks: Array<Block>;

    constructor() { 
        // var lastTime = 0;
        // var vendors = ['ms', 'moz', 'webkit', 'o'];
        // for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        //     window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        //     window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
        //                                || window[vendors[x]+'CancelRequestAnimationFrame'];
        // }
     
        // if (!window.requestAnimationFrame)
        //     window.requestAnimationFrame = function(callback, element) {
        //         var currTime = new Date().getTime();
        //         var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        //         var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
        //           timeToCall);
        //         lastTime = currTime + timeToCall;
        //         return id;
        //     };
     
        // if (!window.cancelAnimationFrame)
        //     window.cancelAnimationFrame = function(id) {
        //         clearTimeout(id);
        //     };
    }

    gameLoop(){
        console.log("gameLoop()");

        setInterval(() => {

            if (!this.isdrawing) {
                this.isdrawing = true;

                var scroll = 
                    (this.key_walk_right && this.bg.canScrollRight()) ? -1 :
                    (this.key_walk_left && this.bg.canScrollLeft()) ? 1 : 0
    
                this.bg.update(scroll, this.key_jump);
                this.bg.render();
    
                this.mario.update(scroll, this.key_jump);
                this.mario.render();

                this.blocks[0].update(scroll, this.key_jump);
                this.blocks[0].render();
        
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
            x: MARIO_POSITION_X,
            y: MARIO_POSITION_Y
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
                //x: 913,
                x: 200,
                y: 483,
                sourceWidth: 61,
                sourceHeight: 59,
                frameWidth: 61,
                frameHeight: 59
            })
        ];

        // this.blocks = new Array<Block>();
        // this.blocks.push
        // {
        //     new Block({
        //         context: this.canvasE1.nativeElement.getContext('2d'),
        //         images: [ 
        //             this.imgBlock.nativeElement
        //          ]    
        //     })
        // };
        
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
    lastAction: MARIO_ACTIONS = MARIO_ACTIONS.STAND_RIGHT;

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
        return (this.level1.sourceX > MARIO_POSITION_X) && (this.level1.sourceX - MARIO_WALK_SPEED) >= MARIO_POSITION_X
    };  
    update = function(scroll: number, jump: boolean){
        // this.x += scroll;
        if (jump){
            if (this.lastAction == MARIO_ACTIONS.STAND_RIGHT ||
                this.lastAction == MARIO_ACTIONS.STAND_LEFT) {
                this.lastAction = MARIO_ACTIONS.JUMP;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || 
                this.lastAction == MARIO_ACTIONS.JUMP_RIGHT){
                this.lastAction = MARIO_ACTIONS.JUMP_RIGHT;

            } else if (
                this.lastAction == MARIO_ACTIONS.WALK_LEFT || 
                this.lastAction == MARIO_ACTIONS.JUMP_LEFT){
                this.lastAction = MARIO_ACTIONS.JUMP_LEFT;
            }
        } else {
            //If we are not JUMPING then we must be FALLING
            if (scroll > 0) {
                this.lastAction = MARIO_ACTIONS.WALK_LEFT;

            } else if (scroll < 0) {
                this.lastAction = MARIO_ACTIONS.WALK_RIGHT;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_LEFT || 
                this.lastAction == MARIO_ACTIONS.STAND_LEFT) {
                this.lastAction = MARIO_ACTIONS.STAND_LEFT;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || 
                this.lastAction == MARIO_ACTIONS.STAND_RIGHT) {
                this.lastAction = MARIO_ACTIONS.STAND_RIGHT;

            } else {  
                this.lastAction = MARIO_ACTIONS.STAND_RIGHT;
            }
        }
        if (this.lastAction == MARIO_ACTIONS.WALK_LEFT || this.lastAction == MARIO_ACTIONS.JUMP_LEFT){
            this.level1.sourceX = (this.level1.sourceX - MARIO_WALK_SPEED) > MARIO_POSITION_X ? 
                this.level1.sourceX - MARIO_WALK_SPEED : 
                MARIO_POSITION_X;
        }
        if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || this.lastAction == MARIO_ACTIONS.JUMP_RIGHT){
            this.level1.sourceX = (this.level1.sourceX + MARIO_WALK_SPEED) < (this.level1.image.width - this.level1.frameWidth) ? 
                this.level1.sourceX + MARIO_WALK_SPEED : 
                this.level1.image.width - this.level1.frameWidth;
        }
        if ((this.lastAction == MARIO_ACTIONS.JUMP_LEFT || 
            this.lastAction == MARIO_ACTIONS.JUMP_RIGHT || 
            this.lastAction == MARIO_ACTIONS.JUMP) &&
            !this.isFalling) {
            console.log("sx: " + this.level1.sourceX +
                ", sy: " + this.level1.sourceY +
                ", sw: " + this.level1.sourceWidth +
                ", sh: " + this.level1.sourceHeight +
                ", dx: " + this.level1.x +
                ", dy: " + this.level1.y +
                ", dw: " + this.level1.frameWidth +
                ", dh: " + this.level1.frameHeight ); 

            if (this.level1.sourceY <= 0 && 
                this.level1.sourceY > MARIO_MAX_JUMP_HEIGHT){

                if (this.level1.sourceY - MARIO_JUMP_SPEED <= MARIO_MAX_JUMP_HEIGHT){
                    this.level1.sourceY = MARIO_MAX_JUMP_HEIGHT;
                    this.isFalling = true; //character is falling, cancel asc, begin falling
                } else {
                    this.level1.sourceY -= MARIO_JUMP_SPEED;
                }
            }
        } else {
            if (this.level1.sourceY + MARIO_FALL_SPEED >= 0){
                this.level1.sourceY = 0;
                this.isFalling = false;
            } else {
                this.level1.sourceY += MARIO_FALL_SPEED;
            }
        }
    };
    render = function(){
        this.level1.render();
    };
}

class Block {
    myBlock: Sprite;
    lastAction: MARIO_ACTIONS.STAND_RIGHT;

    constructor (options){
        this.myBlock = new Sprite({ 
            context:        options.context, 
            image:          options.images[0], 
            x:              options.x, 
            y:              options.y,
            sourceWidth:    options.sourceWidth, 
            sourceHeight:   options.sourceHeight,
            frameWidth:     options.frameWidth,
            frameHeight:    options.frameHeight });
    }
    update = function(scroll: number, jump: boolean){
        if (jump){
            if (this.lastAction == MARIO_ACTIONS.STAND_RIGHT ||
                this.lastAction == MARIO_ACTIONS.STAND_LEFT) {
                this.lastAction = MARIO_ACTIONS.JUMP;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || 
                this.lastAction == MARIO_ACTIONS.JUMP_RIGHT){
                this.lastAction = MARIO_ACTIONS.JUMP_RIGHT;

            } else if (
                this.lastAction == MARIO_ACTIONS.WALK_LEFT || 
                this.lastAction == MARIO_ACTIONS.JUMP_LEFT){
                this.lastAction = MARIO_ACTIONS.JUMP_LEFT;
            }
        } else {
            //If we are not JUMPING then we must be FALLING
            if (scroll > 0) {
                this.lastAction = MARIO_ACTIONS.WALK_LEFT;

            } else if (scroll < 0) {
                this.lastAction = MARIO_ACTIONS.WALK_RIGHT;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_LEFT || 
                this.lastAction == MARIO_ACTIONS.STAND_LEFT) {
                this.lastAction = MARIO_ACTIONS.STAND_LEFT;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || 
                this.lastAction == MARIO_ACTIONS.STAND_RIGHT) {
                this.lastAction = MARIO_ACTIONS.STAND_RIGHT;

            } else {  
                this.lastAction = MARIO_ACTIONS.STAND_RIGHT;
            }
        }
        if (this.lastAction == MARIO_ACTIONS.WALK_LEFT || this.lastAction == MARIO_ACTIONS.JUMP_LEFT){
            this.myBlock.x = this.myBlock.x + MARIO_WALK_SPEED;
        }
        if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || this.lastAction == MARIO_ACTIONS.JUMP_RIGHT){
            this.myBlock.x = this.myBlock.x - MARIO_WALK_SPEED;
        }
    };
    render = function(){
        this.myBlock.render();
    };
}

class Character {
    mario_still_lt: Sprite;
    mario_still_rt: Sprite;
    mario_walk_lt:  Sprite;
    mario_walk_rt:  Sprite;
    mario_jump_lt:  Sprite;
    mario_jump_rt:  Sprite;
    lastAction: MARIO_ACTIONS.STAND_RIGHT;

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
            ticksPerFrame:  MARIO_TICKS_PER_FRAME, 
            sourceWidth:    options.sourceWidth     || FRAME_WIDTH, 
            sourceHeight:   options.sourceHeight    || FRAME_HEIGHT,
            frameWidth:     options.frameWidth      || FRAME_WIDTH,
            frameHeight:    options.frameHeight     || FRAME_HEIGHT });
        this.mario_walk_rt  = new Sprite({ context: options.context, image: options.images[3], x: options.x, y: options.y,
            ticksPerFrame:  MARIO_TICKS_PER_FRAME, 
            sourceWidth:    options.sourceWidth     || FRAME_WIDTH, 
            sourceHeight:   options.sourceHeight    || FRAME_HEIGHT,
            frameWidth:     options.frameWidth      || FRAME_WIDTH,
            frameHeight:    options.frameHeight     || FRAME_HEIGHT });
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
    }

    update = function(scroll: number, jump: boolean){
        // this.x += scroll;
        if (jump){
            if (this.lastAction == MARIO_ACTIONS.STAND_RIGHT ||
                this.lastAction == MARIO_ACTIONS.STAND_LEFT) {
                this.lastAction = MARIO_ACTIONS.JUMP;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || 
                this.lastAction == MARIO_ACTIONS.JUMP_RIGHT){
                this.lastAction = MARIO_ACTIONS.JUMP_RIGHT;

            } else if (
                this.lastAction == MARIO_ACTIONS.WALK_LEFT || 
                this.lastAction == MARIO_ACTIONS.JUMP_LEFT){
                this.lastAction = MARIO_ACTIONS.JUMP_LEFT;
            }
        } else {
            //If we are not JUMPING then we must be FALLING
            if (scroll < 0) {
                this.lastAction = MARIO_ACTIONS.WALK_RIGHT;

            } else if (scroll > 0) {
                this.lastAction = MARIO_ACTIONS.WALK_LEFT;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_LEFT || 
                this.lastAction == MARIO_ACTIONS.STAND_LEFT) {
                this.lastAction = MARIO_ACTIONS.STAND_LEFT;

            } else if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT || 
                this.lastAction == MARIO_ACTIONS.STAND_RIGHT) {
                this.lastAction = MARIO_ACTIONS.STAND_RIGHT;

            } else {  
                this.lastAction = MARIO_ACTIONS.STAND_RIGHT;
            }
        }

    };
    render = function(){
        switch (this.lastAction){
            case MARIO_ACTIONS.WALK_LEFT: {
                this.mario_walk_lt.update();
                this.mario_walk_lt.render();
                break;
            }
            case MARIO_ACTIONS.WALK_RIGHT: {
                this.mario_walk_rt.update();
                this.mario_walk_rt.render();
                break;
            }
            case MARIO_ACTIONS.STAND_LEFT: {
                this.mario_still_lt.update();
                this.mario_still_lt.render();
                break;
            }
            case MARIO_ACTIONS.STAND_RIGHT: {
                this.mario_still_rt.update();
                this.mario_still_rt.render();
                break;
            }
            case MARIO_ACTIONS.JUMP_LEFT: {
                this.mario_jump_lt.update();
                this.mario_jump_lt.render();
                break;
            }
           case MARIO_ACTIONS.JUMP_RIGHT: {
                this.mario_jump_rt.update();
                this.mario_jump_rt.render();
                break;
            }
            case MARIO_ACTIONS.JUMP: {
                if (this.lastAction == MARIO_ACTIONS.STAND_LEFT){
                    this.mario_jump_lt.update();
                    this.mario_jump_lt.render();

                } else {
                    this.mario_jump_rt.update();
                    this.mario_jump_rt.render();
                }
                break;
            }
            default: {
                console.log("switch (action) == default");
                break;
            }
        }
    }
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