import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output, HostListener } from '@angular/core';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { log, debuglog } from 'util';

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37,
    SPACE = 32,
    CHAR_A = 65,
    CHAR_D = 68
  }

@Component({
  selector: 'myCanvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {
    
    @ViewChild('canvasE1') myCanvas: ElementRef;
    @ViewChild('img') img: ElementRef;
    private ctx: CanvasRenderingContext2D;
    private xpos: number = 0;
    private ypos: number = 0;
    private layer1_speed: number = 5;
    private layer2_speed: number = 3;
    private layer3_speed: number = 1;
    private move_up: boolean = false;
    private move_left_bg: boolean = false;
    private move_right_bg: boolean = false;
    private momentum: number = 0;
    private momentum_max: number = 5;
    private running: boolean = false;
    private refresh_rate_bg: number = 100;
    private redraw_bg: boolean = false;
    private jumping: boolean = false;
    private jump_counter: number = 0;
    private isdrawing = false;
    private element: HTMLImageElement;


    imgWidth: number;
    imgHeight: number;
    src: string;

    constructor() { 
        this.imgWidth = 100;
        this.imgHeight = 100;
        this.src = 'assets/super-mario.png';    
    }

    ngOnInit(){
    }

    afterLoading(){
        this.ctx.drawImage(this.element, 0, 0, this.imgWidth, this.imgHeight);
    }

    ngAfterViewInit() {    
        console.log("ngAfterViewInit()");

        this.ctx = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        this.element = this.img.nativeElement;

        this.draw();

        setInterval(() => {

            if (this.move_right_bg)    this.xpos += -1;
            if (this.move_left_bg)     this.xpos += 1;

            if (this.move_left_bg || this.move_right_bg) {
                
                this.draw();
            }
        }, this.refresh_rate_bg);
    }

    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent){
        console.log("window:keydown => %s", event.keyCode.toString());

        // this.resetActions();
        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D){
            // this.xpos = this.xpos + -1;
            this.move_right_bg = true;
            // this.redraw = true;

        } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A){
            // this.xpos = this.xpos + 1;
            this.move_left_bg = true;
            // this.redraw = true;

        } else if (event.keyCode == KEY_CODE.SPACE){
            // this.ypos = this.ypos + 1;
            // this.jumping = true;
            this.move_up = true;
            // this.redraw = true;

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
            this.move_right_bg = false;
            // this.xpos = this.xpos + -1;

        } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A){
            this.move_left_bg = false;
            // this.xpos = this.xpos + 1;

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

     clearCanvas(){
        this.ctx.beginPath();

        this.ctx.clearRect(0, 0, (<HTMLCanvasElement>this.myCanvas.nativeElement).width, (<HTMLCanvasElement>this.myCanvas.nativeElement).height);

        this.ctx.closePath();
    }

    draw(){
        if (this.isdrawing) return;
        this.isdrawing = true;

        console.log("redraw: =>", (this.move_left_bg || this.move_right_bg || this.move_up));

        this.clearCanvas();

        this.draw_fg_1();

        this.draw_bg_1();
    
        this.draw_bg_2();

        this.draw_bg_3();

        this.isdrawing = false;
    }

    draw_fg_1(){

        this.ctx.drawImage(this.element, 0, 0, this.imgWidth, this.imgHeight);
    }

    draw_bg_1(){

        // Set line width
        this.ctx.lineWidth = 10;

        // Wall
        this.ctx.strokeRect(75 + (this.xpos * this.layer1_speed), 140 + (this.ypos * 1), 150, 110);

        // Door
        this.ctx.fillRect(130 + (this.xpos * this.layer1_speed), 190 + (this.ypos * 1), 40, 60);

        // Roof
        this.ctx.moveTo(50 + (this.xpos * this.layer1_speed), 140 + (this.ypos * 1));
        this.ctx.lineTo(150 + (this.xpos * this.layer1_speed), 60 + (this.ypos * 1));
        this.ctx.lineTo(250 + (this.xpos * this.layer1_speed), 140 + (this.ypos * 1));
        this.ctx.closePath();
        this.ctx.stroke();
    }

    draw_bg_2(){

        // Set line width
        this.ctx.lineWidth = 5;

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
