import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output, HostListener } from '@angular/core';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { log, debuglog } from 'util';
import { renderComponent } from '@angular/core/src/render3';
// import { maybeQueueResolutionOfComponentResources } from '@angular/core/src/metadata/resource_loading';
// import { HOST_ATTR } from '@angular/platform-browser/src/dom/dom_renderer';

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
const REFRESH: number = 5;
const POSITION_X: number = 200;
const POSITION_Y: number = 650;
const WALK_SPEED: number = 2;
const JUMP_SPEED: number = 3;
const FALL_SPEED: number = 4;
const HEIGHT: number = 64;
const WIDTH: number = 64;
const MAX_JUMP : number = HEIGHT * 5;
const CHAR_TPF: number = 18;
const MYSTERY_TPF: number = 30;
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
export class CanvasComponent implements AfterViewInit, OnInit {
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
    helper: Helper;

    constructor() { 
    }

    gameLoop(){
        console.log("gameLoop()");
        if (this.helper == null) this.helper = new Helper();
        //BEGIN GAME LOOP
        setInterval(() => {
            if (!this.isdrawing) {
                //Set isDrawing (thread contention prevention)
                this.isdrawing = true;
                
                //Get HORIZONTAL movement
                var scroll = 
                    (this.key_walk_right) ? this.bg.canScrollRight() :
                    (this.key_walk_left) ? this.bg.canScrollLeft() : 0;

                //Get VERTICAL movement
                var vert = 0;
                if (this.key_jump && !this.mario.isFalling) {
                    //IS JUMPING
                    var isCollided = this.helper.detectCollision(this.mario, this.blocks);
                    if (!isCollided){
                        // console.log("isCollided: " + isCollided);
                        vert = this.bg.canScrollUp();
                    }
                    this.mario.isFalling = (vert == 0);
                } else {
                    //IS FALLING
                    var isCollided = this.helper.detectCollision(this.mario, this.blocks, "bottom");
                    console.log("isCollided: " + isCollided);
                    if (isCollided){
                        this.bg.setPlatform();
                    } else {
                        this.bg.clearPlatform();
                    }
                    vert = this.bg.canScrollDown();
                    this.mario.isFalling = !(vert == 0);
                }
                //Get NEW MARIO ACTION
                var action = this.helper.getAction(this.mario.lastAction, scroll, vert);
                //UPDATE MARIO SPRITE ANIMATION
                this.mario.update(action);

                //UPDATE FG
                this.blocks.forEach(element => {
                    //FG elements should move opposite the BG element
                    element.update(0-scroll, 0-vert, this.bg.platform_y);
                });

                //UPDATE BG
                this.bg.update(scroll, vert, this.mario, this.blocks);

                //RENDER ALL, FROM BACK TO FRONT
                this.bg.render();
                this.blocks.forEach(element => {
                    element.render();
                });
                this.mario.render();

                this.isdrawing = false;                    
            }
            
        }, REFRESH);
        //END GAME LOOP
    }

    afterLoading(){
        //Don't begin the loop until MARIO arrives to the party
        this.gameLoop();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.init();
    }

    init() {
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
    
        this.imgBlock.nativeElement.src = "assets/block_flashing_ow.png";
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
                frameHeight: MYSTERY_HEIGHT,
                ticksPerFrame: MYSTERY_TPF
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
                frameHeight: MYSTERY_HEIGHT,
                ticksPerFrame: MYSTERY_TPF
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
                frameHeight: MYSTERY_HEIGHT,
                ticksPerFrame: MYSTERY_TPF
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
                frameHeight: MYSTERY_HEIGHT,
                ticksPerFrame: MYSTERY_TPF
            })
        ];
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
        return WALK_SPEED > this.level1.sourceX ? 0 - this.level1.sourceX : 0-WALK_SPEED; 
    };
    canScrollUp = function(){
        var topEdge = this.platform_y - MAX_JUMP;
        // console.log("topEdge:" + topEdge);                          //-320
        // console.log("this.level1.sourceY:" + this.level1.sourceY);  //-316
        // console.log("this.platformY:" + this.platform_y);           // 0

        var vert = this.level1.sourceY - JUMP_SPEED < topEdge ? 
            topEdge - this.level1.sourceY :                         //     this.level1.sourceY - topEdge :
            0-JUMP_SPEED;

        return vert;
    };
    canScrollDown = function(){
        // console.log("this.level1.sourceY:" + this.level1.sourceY);
        // console.log("this.platformY:" + this.platform_y);
        // this.isFalling = (this.level1.sourceY + FALL_SPEED > bottomEdge);            

        // -4 + 3 > 0 ? -4 - 0 : 4 //  4
        // -1 + 3 > 0 ? -1 - 0 : 4 // -1
        return this.level1.sourceY + FALL_SPEED > this.platform_y ? Math.abs(this.level1.sourceY - this.platform_y) : FALL_SPEED;
    };
    setPlatform = function(){
        this.platform_y = this.level1.sourceY;
    };
    clearPlatform = function(){
        this.platform_y = 0;
    };
    update = function(scroll: number, vert: number, mario: Character = null, blocks: Array<Block> = null){
        this.level1.sourceX += scroll;
        this.level1.sourceY += vert;
    };
    render = function(){
        this.level1.render();
    };
}

class Block {
    boundingBox:Sprite;
    lastAction: ACTION.STAND_RIGHT;
    originalY:  number;
    platform_y: number;

    constructor (options){        
        this.boundingBox = new Sprite({ 
            context:        options.context, 
            image:          options.images[0], 
            x:              options.x, 
            y:              options.y,
            ticksPerFrame:  options.ticksPerFrame, 
            sourceWidth:    options.sourceWidth     || MYSTERY_WIDTH, 
            sourceHeight:   options.sourceHeight    || MYSTERY_HEIGHT,
            frameWidth:     options.frameWidth      || MYSTERY_WIDTH,     
            frameHeight:    options.frameHeight     || MYSTERY_HEIGHT }); 
        this.originalY = options.y;
    }

    toString = function(){
        var result = "";
        if (this.boundingBox != null){
            result = this.boundingBox.toString();
        }
        return result;
    };
    update = function(hor: number, vert: number, platform_y: number){
        // this.boundingBox = this.myBlock;
        this.platform_y     = platform_y;
        this.boundingBox.x  += hor;
        this.boundingBox.y  += vert;
        this.boundingBox.update();
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
            return (lastAction == ACTION.WALK_LEFT || lastAction == ACTION.JUMP_LEFT || lastAction == ACTION.STAND_LEFT) ?
                ACTION.JUMP_LEFT :
                ACTION.JUMP_RIGHT;

        } else if (scroll < 0) {
            return ACTION.WALK_LEFT;

        } else if (scroll > 0) {
            return ACTION.WALK_RIGHT;

        } else if (scroll == 0) {
            return (lastAction == ACTION.WALK_LEFT || lastAction == ACTION.JUMP_LEFT || lastAction == ACTION.STAND_LEFT) ?
                ACTION.STAND_LEFT :
                ACTION.STAND_RIGHT;
        }
    };

    detectCollision = function(char: Character, blocks: Block[], top_bottom: string = "top"){
        var hasCollided = false;
        if (char != null){
            var obj1: Sprite = char.boundingBox;

            blocks.forEach(element => {
                var obj2: Sprite = element.boundingBox,
                    char_lt     = obj1.x,
                    char_rt     = obj1.x + obj1.frameWidth,
                    char_bot    = obj1.y,
                    char_top    = obj1.y - obj1.frameHeight,
                    block_lt    = obj2.x,
                    block_rt    = obj2.x + obj2.frameWidth,
                    block_bot   = obj2.y,
                    block_top   = obj2.y - obj2.frameHeight;

                // console.log("horizontal collision");
                if (((char_rt >= block_lt) && (char_lt < block_rt)) ||
                    ((char_lt <= block_rt) && (char_rt > block_rt))){

                    // console.log("vertical collision");
                    if (top_bottom == "top"){
                        if ((char_top + JUMP_SPEED <= block_bot) && (char_bot > block_bot)) {
                            hasCollided = true;
                        }
                    } else {
                        //400 + 4 >= 400 && 350 < 400
                        if ((char_bot + FALL_SPEED >= block_top) && (char_top < block_top)) {
                            hasCollided = true;
                        }
                    }
                }
            });        
        }
        return hasCollided;
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
            ticksPerFrame:  CHAR_TPF, 
            sourceWidth:    options.sourceWidth     || WIDTH, 
            sourceHeight:   options.sourceHeight    || HEIGHT,
            frameWidth:     options.frameWidth      || WIDTH,
            frameHeight:    options.frameHeight     || HEIGHT });
        this.mario_walk_rt  = new Sprite({ context: options.context, image: options.images[3], x: options.x, y: options.y,
            ticksPerFrame:  CHAR_TPF, 
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