import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output, HostListener } from '@angular/core';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { log, debuglog } from 'util';

@Component({
    selector: 'mario',
    templateUrl: './mario.component.html',
    styleUrls: ['./mario.component.css']
  })

//   class Sprite {
//       context: CanvasRenderingContext2D;
//       width: number;
//       height: number;
//   }
  
  export class MarioComponent implements OnInit, AfterViewInit {
    // @ViewChild('mario') myCanvas: ElementRef;
    @ViewChild('img') img: ElementRef;
    private ctx: CanvasRenderingContext2D;
    private element: HTMLImageElement;

    imgWidth: number;
    imgHeight: number;
    src: string;

    
    constructor(parentCtx: CanvasRenderingContext2D) {
        // this.imgWidth = 100;
        // this.imgHeight = 100;
        this.ctx = parentCtx;
        this.src = 'assets/NES - Super Mario Bros - Mario & Luigi.png';
    }


    render(): void {
      this.ctx.drawImage(this.element, 0, 0, 100, 100, 0, 0, 100, 100);

    }

    ngOnInit(): void {

    }      
    ngAfterViewInit(): void {
      // this.element = this.img.nativeElement;

        // this.ctx = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    }
    afterLoading(){
      this.element = this.img.nativeElement;

        // this.ctx.drawImage(this.element, 0, 0, this.imgWidth, this.imgHeight);

        // context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        // img Source image object	Sprite sheet
        // sx	Source x	Frame index times frame width
        // sy	Source y	0
        // sw	Source width	Frame width
        // sh	Source height	Frame height
        // dx	Destination x	0
        // dy	Destination y	0
        // dw	Destination width	Frame width
        // dh	Destination height	Frame height
        // this.ctx.drawImage(this.element, 0, 0, 100, 100, 0, 0, 100, 100);

    }
  }