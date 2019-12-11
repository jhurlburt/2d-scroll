import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Constants } from '../helpers/Constants';
import { Level } from '../models/Background';
import { Character } from '../models/Character';
import { StandPipe } from '../models/StandPipe';
import { Enemy } from '../models/Enemy';
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
  @ViewChild('audioOption') sndMainTheme: ElementRef<HTMLAudioElement>;

  title: string = 'Super Mario Brothers';
  isdrawing: boolean = false;
  imagesLoaded: number = 0;
  totalImages: number = 13;
  level1: Level;

  private gameLoop() {
    console.log("begin gameLoop()");

    setInterval(() => {
      if (!this.isdrawing) {
        this.isdrawing = true;    
        this.level1.updateFrame();
        this.level1.renderFrame();
        this.isdrawing = false;
      }}, Constants.REFRESH);
  }

  private handleCheckpoint(options){
    if (options.name == "Checkpoint"){
      this.level1.addEnemy(
        new Enemy({ context: this.canvasE1.nativeElement.getContext('2d'), images: [ 
          this.imgMushroomEnemyWalking.nativeElement, this.imgMushroomEnemyWalking.nativeElement ]
          , x: options.x, y: options.y, moveLeft: options.moveLeft
          , sourceWidth:  Constants.CHAR_WIDTH, sourceHeight: Constants.CHAR_HEIGHT
          , frameWidth:   Constants.CHAR_WIDTH, frameHeight:  Constants.CHAR_HEIGHT    
          , canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })        
      );
    }
  }

  afterLoading() {
    if (++this.imagesLoaded == this.totalImages) { this.allImagesLoaded(); }
  }

  allImagesLoaded(){
    console.log("begin allImagesLoaded()");
    this.canvasE1.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.canvasE1.nativeElement.width = Constants.CANVAS_WIDTH;
    let ctx: CanvasRenderingContext2D = this.canvasE1.nativeElement.getContext('2d');

    this.sndMainTheme.nativeElement.play();

    this.level1 = new Level (
      new Sprite({ context: ctx, image: this.imgBackground1_1.nativeElement,
        sourceWidth: this.canvasE1.nativeElement.width, sourceHeight: this.canvasE1.nativeElement.height,
        frameWidth: this.canvasE1.nativeElement.width, frameHeight: this.canvasE1.nativeElement.height }),
      new Character({ context: ctx, images: [ 
          this.imgMarioStillLt.nativeElement
        , this.imgMarioStillRt.nativeElement
        , this.imgMarioWalkLt.nativeElement
        , this.imgMarioWalkRt.nativeElement
        , this.imgMarioJumpLt.nativeElement
        , this.imgMarioJumpRt.nativeElement ]
      , x: Constants.CHAR_X_POS, y: Constants.CHAR_Y_POS
      , sourceWidth:  Constants.CHAR_WIDTH, sourceHeight: Constants.CHAR_HEIGHT
      , frameWidth:   Constants.CHAR_WIDTH, frameHeight:  Constants.CHAR_HEIGHT
      , canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })
    ); 

    this.level1.addEnemy(
      new Enemy({ context: ctx, images: [ this.imgMushroomEnemyWalking.nativeElement, this.imgMushroomEnemyWalking.nativeElement ]
      , x: Constants.CHAR_X_POS + 600, y: 0, moveLeft: true 
      , sourceWidth:  Constants.CHAR_WIDTH, sourceHeight: Constants.CHAR_HEIGHT
      , frameWidth:   Constants.CHAR_WIDTH, frameHeight:  Constants.CHAR_HEIGHT
      , canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })
    );

    this.level1.addTerras([
      new Terra({ context: ctx, images: [ null ], x: 0, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 3930, frameHeight: 150 })
      , new Terra({ context: ctx, images: [ null ], x: 4069, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 850, frameHeight: 150 })
      , new Terra({ context: ctx, images: [ null ], x: 5098, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 850, frameHeight: 150 })
      , new Terra({ context: ctx, images: [ null ], x: 5948, y: 800, sourceWidth: 120, sourceHeight: 115, frameWidth: 3200, frameHeight: 150 })
    ]);

    this.level1.addPipes([
      new StandPipe({ context: ctx, images: [ null ], x: 1595, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 115 })
      , new StandPipe({ context: ctx, images: [ null ], x: 2170, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 170 })
      , new StandPipe({ context: ctx, images: [ null ], x: 2630, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 230 })
      , new StandPipe({ context: ctx, images: [ null ], x: 3245, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 230 })
    ]);

    this.level1.addBlocks([
      new BrickBlock({ context: ctx, images: [ this.imgBrick.nativeElement ], x: 1141 })
      , new BrickBlock({ context: ctx, images: [ this.imgBrick.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH * 2 })
      , new BrickBlock({ context: ctx, images: [ this.imgBrick.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH * 4 })
      , new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], x: 914 })
      , new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH })
      , new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH * 3 })
      , new MysteryBlock({ context: ctx, images: [ this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement ], x: 1141 + Constants.BLOCK_WIDTH * 2,  y: Constants.PLATFORM_2_Y })
    ]);
    
    this.level1.notifyParent.subscribe((options) => {
      console.log("Name: " + options.name);
      if (options.name == "Checkpoint"){
        this.handleCheckpoint(options);
      }
    });
    this.gameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  keyboardEvent(event: KeyboardEvent) {
    this.level1.handleKeyboardEvent(event);
  }
}