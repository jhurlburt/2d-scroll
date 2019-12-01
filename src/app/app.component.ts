import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Constants } from '../helpers/Constants';
import { Helper } from '../helpers/Helper';
import { Level } from '../models/Background';
import { Character } from '../models/Character';
import { StandPipe } from '../models/StandPipe';
import { Enemy } from '../models/Enemy';
// import { Block } from '../models/Block';
import { Sprite } from 'src/models/Sprite';
import { Terra } from 'src/models/Terra';
import { BrickBlock } from 'src/models/BrickBlock';
import { MysteryBlock } from 'src/models/MysteryBlock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
  historyLog : string [] = [];

  private gameLoop() {
    console.log("begin gameLoop()");
    setInterval(() => {
      if (!this.isdrawing) {
        this.isdrawing = true;    

        if (!this.historyLog.includes("add enemy 2")){
          if ((this.level1.mario.getBounds().x + this.level1.getBounds().sourceX) > 1200){
            this.historyLog.push("add enemy 2");
            this.level1.addEnemy(
              new Enemy({ context: this.canvasE1.nativeElement.getContext('2d'), images: [ 
                  this.imgMushroomEnemyWalking.nativeElement, this.imgMushroomEnemyWalking.nativeElement ]
              , x: this.level1.mario.getBounds().x + 600, y: 0, moveLeft: false
              , canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })      
            );
          }
        }          
        this.level1.updateFrame();
        this.level1.renderFrame();
        this.isdrawing = false;
      }}, Constants.REFRESH);
  }

  afterLoading() {
    if (++this.imagesLoaded == this.totalImages) { this.allImagesLoaded(); }
  }

  allImagesLoaded(){
    console.log("begin allImagesLoaded()");
    this.canvasE1.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.canvasE1.nativeElement.width = Constants.CANVAS_WIDTH;
    let ctx: CanvasRenderingContext2D = this.canvasE1.nativeElement.getContext('2d');

    this.level1 = new Level (
      new Sprite({ context: ctx, image: this.imgBackground1_1.nativeElement,
        sourceWidth: this.canvasE1.nativeElement.width, sourceHeight: this.canvasE1.nativeElement.height,
        frameWidth: this.canvasE1.nativeElement.width, frameHeight: this.canvasE1.nativeElement.height }),
      new Character({ context: ctx, images: [ 
        this.imgMarioStillLt.nativeElement, this.imgMarioStillRt.nativeElement,
        this.imgMarioWalkLt.nativeElement, this.imgMarioWalkRt.nativeElement,
        this.imgMarioJumpLt.nativeElement, this.imgMarioJumpRt.nativeElement ]
      , x: Constants.CHAR_X_POS, y: Constants.CHAR_Y_POS
      , canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })
    ); 

    //Add enemies
    if (!this.historyLog.includes("add enemy 1")){
      this.level1.addEnemy(
        new Enemy({ context: ctx, images: [ this.imgMushroomEnemyWalking.nativeElement, this.imgMushroomEnemyWalking.nativeElement ]
        , x: Constants.CHAR_X_POS + 600, y: 0, moveLeft: true
        , canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })
      );
      this.historyLog.push("add enemy 1");
    }        
    this.level1.addTerra(
      new Terra({ context: ctx, images: [ null ], x: 0, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 3930, frameHeight: 150 })
    );
    this.level1.addTerra(
      new Terra({ context: ctx, images: [ null ], x: 4069, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 850, frameHeight: 150 })
    );
    this.level1.addTerra(
      new Terra({ context: ctx, images: [ null ], x: 5098, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 850, frameHeight: 150 })
    );
    this.level1.addTerra(
      new Terra({ context: ctx, images: [ null ], x: 5948, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 3200, frameHeight: 150 })
    );
    this.level1.addPipe(
      new StandPipe({ context: ctx, images: [ null ], x: 1595, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 115 })
    );
    this.level1.addPipe(
      new StandPipe({ context: ctx, images: [ null ], x: 2170, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 170 })
    );
    this.level1.addPipe(
      new StandPipe({ context: ctx, images: [ null ], x: 2630, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 230 })
    );
    this.level1.addPipe(
      new StandPipe({ context: ctx, images: [ null ], x: 3245, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 230 })
    );
    this.level1.addBlock(
      new BrickBlock({ context: ctx, images: [ this.imgBrick.nativeElement ], x: 1141 })
    );
    this.level1.addBlock(
      new BrickBlock({ context: ctx, images: [ this.imgBrick.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH * 2 })
    );
    this.level1.addBlock(
      new BrickBlock({ context: ctx, images: [ this.imgBrick.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH * 4 })
    );
    this.level1.addBlock(
      new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], x: 914 })
    );
    this.level1.addBlock(
      new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH })
    );
    this.level1.addBlock(
      new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH * 3 })
    );
    this.level1.addBlock(
      new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], name: "Question", x: 1141 + Constants.BLOCK_WIDTH * 2,  y: Constants.PLATFORM_2_Y })
    );
    this.gameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  keyboardEvent(event: KeyboardEvent) {
    this.level1.handleKeyboardEvent(event);
  }
}