import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { Constants } from '../helpers/Constants';
import { Helper } from '../helpers/Helper';
import { Level } from '../models/Background';
import { Character } from '../models/Character';
import { StandPipe } from '../models/StandPipe';
import { Enemy } from '../models/Enemy';
import { Block } from '../models/Block';
import { Sprite } from 'src/models/Sprite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasE1') canvasE1: ElementRef<HTMLCanvasElement>;
  @ViewChild('imgMarioWalkingRight') imgMarioWalkRt: ElementRef<HTMLImageElement>;
  @ViewChild('imgMarioWalkingLeft') imgMarioWalkLt: ElementRef<HTMLImageElement>;
  @ViewChild('imgMarioStillLeft') imgMarioStillLt: ElementRef<HTMLImageElement>;
  @ViewChild('imgMarioStillRight') imgMarioStillRt: ElementRef<HTMLImageElement>;
  @ViewChild('imgMarioJumpRight') imgMarioJumpRt: ElementRef<HTMLImageElement>;
  @ViewChild('imgMarioJumpLeft') imgMarioJumpLt: ElementRef<HTMLImageElement>;
  @ViewChild('imgBackground1_1') imgBackground1_1: ElementRef<HTMLImageElement>;
  @ViewChild('imgBlock') imgBlock: ElementRef<HTMLImageElement>;
  @ViewChild('imgBlock_hit') imgBlock_hit: ElementRef<HTMLImageElement>;
  @ViewChild('imgBlock_after') imgBlock_after: ElementRef<HTMLImageElement>;
  @ViewChild('imgBrick') imgBrick: ElementRef<HTMLImageElement>;
  @ViewChild('imgMushroomEnemyWalking') imgMushroomEnemyWalking: ElementRef<HTMLImageElement>;
  @ViewChild('imgMushroomEnemyFlat') imgMushroomEnemyFlat: ElementRef<HTMLImageElement>;

  title: string = 'Super Mario Brothers';
  isdrawing: boolean = false;
  level1: Level;
  imagesLoaded: number = 0;
  totalImages: number = 13;

  constructor() {
  }

  private gameLoop() {
    console.log("begin gameLoop");

    setInterval(() => {
      if (!this.isdrawing) {
        //Set isDrawing (thread contention prevention)
        this.isdrawing = true;

        //TODO: Something like this...
        //Update will fire the event on each of the delegates
        //Update does not need parameters since has direct access to the parameters
        // this.update();

        //GameLoop.update -> Delegate.onupdate
        //Delegate.detect -> BG.ondetect
        //BG.update -> Delegate.onupdate -- brings it full circle

        //From each delegate, do the following
        //Delegates will need to notify bg of collisions
        //BG will need to handle collision notifications by restricting movements
        //BG will need to notify delegates of any change in movement
        // [delegate].detectCollision();

        //No need to loop because each delegate will receive the event
        // this.enemies.forEach(element => {
        //   element.detectCollision();
        // });
        //...not like this below.

        //Render will fire the event on each of the delegates
        // this.render();

        this.update();
        //Next, render all elements
        this.render();
        //Next, stop drawing
        this.isdrawing = false;
      }
    }, Constants.REFRESH);
  }

  private update(){
    this.level1.update();
  }

  private render() {
    //RENDER ALL, FROM BACK TO FRONT
    this.level1.render();
  }

  ngOnInit() {
    //Do nothing
  }

  afterLoading() {
    this.imagesLoaded++;
    if (this.imagesLoaded == this.totalImages) {
      this.allImagesLoaded();
    }
  }

  ngAfterViewInit() {     
  }

  allImagesLoaded(){

    console.log("ngAfterViewInit()");

    this.canvasE1.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.canvasE1.nativeElement.width = Constants.CANVAS_WIDTH;

    let ctx: CanvasRenderingContext2D = this.canvasE1.nativeElement.getContext('2d');

    this.level1 = new Level(
      new Sprite({ context: ctx, image: this.imgBackground1_1.nativeElement,
        sourceWidth: this.canvasE1.nativeElement.width, sourceHeight: this.canvasE1.nativeElement.height,
        frameWidth: this.canvasE1.nativeElement.width, frameHeight: this.canvasE1.nativeElement.height }),
      new Character({ context: ctx, 
        images: [ 
          this.imgMarioStillLt.nativeElement, this.imgMarioStillRt.nativeElement,
          this.imgMarioWalkLt.nativeElement, this.imgMarioWalkRt.nativeElement,
          this.imgMarioJumpLt.nativeElement, this.imgMarioJumpRt.nativeElement ], 
        x: Constants.CHAR_X, y: Constants.CHAR_Y, id: Helper.newGuid(), 
        canvasWidth: this.canvasE1.nativeElement.width }),
      [ new Enemy({ context: ctx, 
        images: [ 
          this.imgMushroomEnemyWalking.nativeElement, this.imgMushroomEnemyWalking.nativeElement ], 
          x: Constants.CHAR_X + 500, y: Constants.CHAR_Y, id: Helper.newGuid() })],
      [ new StandPipe({ context: ctx, images: [ null ], x: 2545, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 115, id: Helper.newGuid() })],
      [ new Block({ context: ctx, images: [ this.imgBrick.nativeElement ], name: "Brick", x: 1141, id: Helper.newGuid() }),
        new Block({ context: ctx, images: [ this.imgBrick.nativeElement ], name: "Brick", x: 1141 + Constants.BLOCK_WIDTH * 2, id: Helper.newGuid() }),
        new Block({ context: ctx, images: [ this.imgBrick.nativeElement ], name: "Brick", x: 1141 + Constants.BLOCK_WIDTH * 4, id: Helper.newGuid() }),
        new Block({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], name: "Question", x: 914, id: Helper.newGuid() }),
        new Block({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], name: "Question", x: 1141 + Constants.BLOCK_WIDTH, id: Helper.newGuid() }),
        new Block({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], name: "Question", x: 1141 + Constants.BLOCK_WIDTH * 3, id: Helper.newGuid() }),
        new Block({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], name: "Question", x: 1141 + Constants.BLOCK_WIDTH * 2,  y: Constants.PLATFORM_2_Y, id: Helper.newGuid() })
      ]); 

    this.gameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    this.level1.handleKeyDownEvent(event);
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    this.level1.handleKeyUpEvent(event);
  }
}