import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output, HostListener } from '@angular/core';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { log, debuglog } from 'util';
import { renderComponent } from '@angular/core/src/render3';

const MARIO_POSITION_X: number = 50;
const MARIO_POSITION_Y: number = 650;
const MAX_MOMENTUM: number = 5;
const REFRESH_RATE: number = 1;
const MARIO_WALK_SPEED: number = 3;

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37,
    SPACE = 32,
    CHAR_A = 65,
    CHAR_D = 68
}

export enum MARIO_ACTIONS {
    STILL_LEFT = 0,
    STILL_RIGHT = 1,
    WALK_LEFT = 2,
    WALK_RIGHT = 3,
    JUMP_LEFT = 4,
    JUMP_RIGHT = 5,
    JUMP = 4
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
    
    ctx: CanvasRenderingContext2D;
    xpos: number = 0;
    ypos: number = 0;
    layer1_speed: number = 3;
    layer2_speed: number = 2;
    layer3_speed: number = 1;
    momentum: number = 0;
    move_up: boolean = false;
    walk_lt: boolean = false;
    walk_rt: boolean = false;
    jumping: boolean = false;
    jump_counter: number = 0;
    isdrawing = false;
    mario: Character;
    bg: Background;
    lastAction: MARIO_ACTIONS;

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

            if (this.isdrawing) return;
            this.isdrawing = true;
    
            console.log("redraw: =>", (this.walk_lt || this.walk_rt || this.move_up));

            this.xpos += (this.walk_rt ? -1 : (this.walk_lt ? 1 : 0));

            //TODO: replace with this.background.render(this.lastAction)
            // this.draw_bg();

            if (this.jumping){
                if (this.lastAction == MARIO_ACTIONS.STILL_RIGHT ||
                    this.lastAction == MARIO_ACTIONS.WALK_RIGHT || 
                    this.lastAction == MARIO_ACTIONS.JUMP_RIGHT){
                    this.lastAction = MARIO_ACTIONS.JUMP_RIGHT
                } else if (
                    this.lastAction == MARIO_ACTIONS.STILL_LEFT ||
                    this.lastAction == MARIO_ACTIONS.WALK_LEFT || 
                    this.lastAction == MARIO_ACTIONS.JUMP_LEFT){
                    this.lastAction = MARIO_ACTIONS.JUMP_LEFT
                }
            } else {
                if (this.walk_rt)
                    this.lastAction = MARIO_ACTIONS.WALK_RIGHT;
                else if (this.walk_lt)
                    this.lastAction = MARIO_ACTIONS.WALK_LEFT;
                else if (this.lastAction == MARIO_ACTIONS.WALK_RIGHT) 
                    this.lastAction = MARIO_ACTIONS.STILL_RIGHT;
                else if (this.lastAction == MARIO_ACTIONS.WALK_LEFT) 
                    this.lastAction = MARIO_ACTIONS.STILL_LEFT;
            }

            this.bg.render(this.lastAction);

            this.mario.render(this.lastAction);
    
            this.isdrawing = false;
            
        }, REFRESH_RATE);
        // window.requestAnimationFrame(this.gameLoop);
    }

    ngAfterViewInit() {    
        console.log("ngAfterViewInit()");

        this.canvasE1.nativeElement.height = 800;
        this.canvasE1.nativeElement.width = 800;

        this.ctx = this.canvasE1.nativeElement.getContext('2d');

        this.imgMarioStillLt.nativeElement.src = "assets/mario-still-left.png";
        this.imgMarioStillRt.nativeElement.src = "assets/mario-still-right.png";
        this.imgMarioWalkLt.nativeElement.src = "assets/mario-walking-left.png";
        this.imgMarioWalkRt.nativeElement.src = "assets/mario-walking-right.png";
        this.imgMarioJumpLt.nativeElement.src = "assets/mario-jump-left.png";
        this.imgMarioJumpRt.nativeElement.src = "assets/mario-jump-right.png";
        this.imgBackground1_1.nativeElement.src = "assets/bg-1-1.png";
        // this.imgBackground1_1.nativeElement.height = this.canvasE1.nativeElement.height;

        this.mario = new Character({
            context: this.ctx,
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

        this.bg = new Background({
            context: this.ctx,
            images: [ 
                this.imgBackground1_1.nativeElement
             ],
             sourceWidth: this.canvasE1.nativeElement.width,
             sourceHeight: this.canvasE1.nativeElement.height,
             frameWidth: this.canvasE1.nativeElement.width,
             frameHeight: this.canvasE1.nativeElement.height,

        });
        
        // window.requestAnimationFrame(this.gameLoop);
        this.gameLoop();
    }

    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent){
        console.log("window:keydown => %s", event.keyCode.toString());

        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D){
            this.walk_rt = true;

        } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A){
            this.walk_lt = true;

        } else if (event.keyCode == KEY_CODE.SPACE){
            this.jumping = true;

            //Rules of Jumping
            //1. movement gradually decreases over time
            //2. power gradually increases over time
            //3. when any of these conditions are met, begin jump:
            //   * power is at full capacity
            //   * keyup event fired on SPACE key

            //pressing the space bar should launch the player
            //the longer the button is held down, the further the jump
            //regular jump is 
            //gravity does the work of returning the player to earth
            //the higher the altitude, the greater the effects of gravity
        }
    }


    @HostListener('window:keyup', ['$event'])
    keyUpEvent(event: KeyboardEvent){
        console.log("window:keyup => %s", event.keyCode.toString());

        // this.resetActions();
        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D){
            this.walk_rt = false;

        } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A){
            this.walk_lt = false;

        } else if (event.keyCode == KEY_CODE.SPACE){
            this.jumping = false;
            this.move_up = false;
            // this.ypos = this.ypos + (this.move_up ? 1 : (this.ypos > 0 ? -1 : 0));
        }
    }

    affectGravity(){
        //Rules of Gravity
        //1. Gravity increases with height at a rate of 
        //   1 gravity unit/1 height unit

        //Momentary jump has power of 
        //   5 height/1 second

        //when SPACE keydown event fires, set jumping = true
        //when player touches ground, set jumping = false


        if (this.ypos > 0){
            //affect gravity on the player
            //or gradually bring player to earth
        }
        
        // height ascending: 5, 8, 10, 11
        // height descending: 10, 8, 6, 4, 2, 0
        if (this.jumping && this.jump_counter == 0){
            //begin the ascent
            this.ypos = this.ypos + 5;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 1){
            this.ypos = this.ypos + 3;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 2){
            this.ypos = this.ypos + 2;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 3){
            this.ypos = this.ypos + 1;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 4){
            this.ypos = this.ypos - 1;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 5){
            this.ypos = this.ypos - 2;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 6){
            this.ypos = this.ypos - 2;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 7){
            this.ypos = this.ypos - 2;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 8){
            this.ypos = this.ypos - 2;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 9){
            this.ypos = this.ypos - 2;
            this.jump_counter += 1;

        } else if (this.jumping && this.jump_counter == 10){
            this.ypos = this.ypos - 2;
            this.jump_counter = 0;
            this.jumping = false;
        }
    }

     clearCanvasAll(){
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, (<HTMLCanvasElement>this.canvasE1.nativeElement).width, (<HTMLCanvasElement>this.canvasE1.nativeElement).height);
        this.ctx.closePath();
    }

    draw_bg(){
        this.clearCanvasAll();
        this.draw_bg_1();
        this.draw_bg_2();
        this.draw_bg_3();
    }

    draw_bg_1(){

        // // Set line width
        // this.ctx.lineWidth = 3;

        // // Wall
        // this.ctx.strokeRect(75 + (this.xpos * this.layer1_speed), 140 + (this.ypos * 1), 150, 110);

        // // Door
        // this.ctx.fillRect(130 + (this.xpos * this.layer1_speed), 190 + (this.ypos * 1), 40, 60);

        // // Roof
        // this.ctx.moveTo(50 + (this.xpos * this.layer1_speed), 140 + (this.ypos * 1));
        // this.ctx.lineTo(150 + (this.xpos * this.layer1_speed), 60 + (this.ypos * 1));
        // this.ctx.lineTo(250 + (this.xpos * this.layer1_speed), 140 + (this.ypos * 1));
        // this.ctx.closePath();
        // this.ctx.stroke();
    }

    draw_bg_2(){

        // Set line width
        this.ctx.lineWidth = 2;

        // Wall
        this.ctx.strokeRect(175 + (this.xpos * this.layer2_speed), 140, 150, 110);

        // Door
        this.ctx.fillRect(230 + (this.xpos * this.layer2_speed), 190, 40, 60);

        // Roof
        this.ctx.moveTo(150 + (this.xpos * this.layer2_speed), 140);
        this.ctx.lineTo(250 + (this.xpos * this.layer2_speed), 60);
        this.ctx.lineTo(350 + (this.xpos * this.layer2_speed), 140);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    draw_bg_3(){
        // Set line width
        this.ctx.lineWidth = 1;

        // Wall
        this.ctx.strokeRect(275 + (this.xpos * this.layer3_speed), 140, 150, 110);

        // Door
        this.ctx.fillRect(330 + (this.xpos * this.layer3_speed), 190, 40, 60);

        // Roof
        this.ctx.moveTo(250 + (this.xpos * this.layer3_speed), 140);
        this.ctx.lineTo(350 + (this.xpos * this.layer3_speed), 60);
        this.ctx.lineTo(450 + (this.xpos * this.layer3_speed), 140);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

class Background {
    bg_1_1: Sprite;
    image: HTMLImageElement;

    constructor(options){
        this.bg_1_1 = new Sprite({ 
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

    render = function(action){
        switch (action){
            case MARIO_ACTIONS.WALK_LEFT: {
                this.bg_1_1.sourceX -= MARIO_WALK_SPEED;
                // this.bg_1_1.update(action);
                this.bg_1_1.render();
                break;
            }
            case MARIO_ACTIONS.WALK_RIGHT: {
                this.bg_1_1.sourceX += MARIO_WALK_SPEED;
                // this.bg_1_1.update(action);
                this.bg_1_1.render();
                break;
            }
            case MARIO_ACTIONS.STILL_LEFT: {
                //do nothing
                break;
            }
            case MARIO_ACTIONS.JUMP_RIGHT: {
                break;
            }
            case MARIO_ACTIONS.JUMP_LEFT: {
                break;
            }
            default: {
                break;
            }
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
            ticksPerFrame:  10, 
            sourceWidth:    options.sourceWidth     || 64, 
            sourceHeight:   options.sourceHeight    || 64,
            frameWidth:     options.frameWidth      || 64,
            frameHeight:    options.frameHeight     || 64 });
        this.mario_walk_rt  = new Sprite({ context: options.context, image: options.images[3], x: options.x, y: options.y,
            ticksPerFrame:  10, 
            sourceWidth:    options.sourceWidth     || 64, 
            sourceHeight:   options.sourceHeight    || 64,
            frameWidth:     options.frameWidth      || 64,
            frameHeight:    options.frameHeight     || 64 });
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
    render = function(action){
        switch (action){
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
            case MARIO_ACTIONS.STILL_LEFT: {
                this.mario_still_lt.update();
                this.mario_still_lt.render();
                break;
            }
            case MARIO_ACTIONS.JUMP_RIGHT: {
                this.mario_jump_rt.update();
                this.mario_jump_rt.render();
                break;
            }
            case MARIO_ACTIONS.JUMP_LEFT: {
                this.mario_jump_lt.update();
                this.mario_jump_lt.render();
                break;
            }
            default: {
                this.mario_still_rt.update();
                this.mario_still_rt.render();
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

    //use to animate characters
    update = function () {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;            
            // If the current frame index is in range
            if (this.frameIndex < this.numberOfFrames - 1) {	
                // Go to the next frame
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        } 
        this.sourceX = this.frameIndex * this.frameWidth;
    };
    render = function () {
        // Clear the canvas
        // this.context.clearRect(this.x, this.y, this.frameWidth, this.frameHeight);
        
        // console.log("sx: " + this.frameIndex + this.frameWidth +
        //             ", sy: " + 0 +
        //             ", sx: " + this.frameIndex + this.frameWidth +
        //             ", sw: " + this.sourceWidth +
        //             ", sh: " + this.sourceHeight +
        //             ", dx: " + this.x +
        //             ", dy: " + this.y +
        //             ", dw: " + this.frameWidth +
        //             ", dh: " + this.frameHeight );
        // Draw the animation
        this.context.drawImage(
          this.image,                        // img  Source image object	Sprite sheet
          this.sourceX,                      // sx	Source x	Frame index times frame width
          this.sourceY,                      // sy	Source y	0
          this.sourceWidth,                  // sw	Source width	Frame width
          this.sourceHeight,                 // sh	Source height	Frame height 
          this.x,                            // dx	Destination x	0
          this.y,                            // dy	Destination y	0
          this.frameWidth,                   // dw	Destination width	Frame width
          this.frameHeight);                 // dh	Destination height	Frame height
    };      
}

