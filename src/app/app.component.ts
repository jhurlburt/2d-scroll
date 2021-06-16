import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Constants } from '../helpers/Constants';
import { Level } from '../models/Level';
import { Character } from '../models/Character';
import { StandPipe } from '../models/StandPipe';
import { Enemy } from '../models/Enemy';
import { Terra } from 'src/models/Terra';
import { BrickBlock } from 'src/models/BrickBlock';
import { MysteryBlock } from 'src/models/MysteryBlock';
import { KEY_CODE } from 'src/helpers/Keyboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('canvasE1') canvasE1: ElementRef<HTMLCanvasElement>;
  @ViewChild('inMemoryCanvas') inMemoryCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('imgBackground1_1') imgBackground1_1: ElementRef<HTMLImageElement>;
  @ViewChild('imgBlock') imgBlock: ElementRef<HTMLImageElement>;
  @ViewChild('imgBlock_hit') imgBlock_hit: ElementRef<HTMLImageElement>;
  @ViewChild('imgBlock_after') imgBlock_after: ElementRef<HTMLImageElement>;
  @ViewChild('imgBrick') imgBrick: ElementRef<HTMLImageElement>;
  @ViewChild('imgMushroomEnemyWalking') imgMushroomEnemyWalking: ElementRef<HTMLImageElement>;
  @ViewChild('imgMushroomEnemyFlat') imgMushroomEnemyFlat: ElementRef<HTMLImageElement>;
  @ViewChild('audioTheme') audioMainTheme: ElementRef<HTMLAudioElement>;
  @ViewChild('audioJump') audioJump: ElementRef<HTMLAudioElement>;
  
  private title: string = 'Super Mario Brothers';
  private isdrawing: boolean = false;
  private imagesLoaded: number = 0;
  private totalImages: number = 5;
  private level1: Level;
  // audioJump: any;
  private audioJumpPlaying: boolean = false;


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
    this.level1.addEnemy(
      new Enemy({ context: this.canvasE1.nativeElement.getContext('2d')
      , dataMaps: [ this.imgMushroomEnemyWalking.nativeElement, this.imgMushroomEnemyWalking.nativeElement ]
      , x: options.x, y: options.y, moveLeft: options.moveLeft
      , canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height 
      })        
    );
  }

  afterLoading() {
    if (++this.imagesLoaded == this.totalImages) { this.allImagesLoaded(); }
  }

  allImagesLoaded(){
    console.log("begin allImagesLoaded()");
    this.canvasE1.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.canvasE1.nativeElement.width = Constants.CANVAS_WIDTH;
    let ctx: CanvasRenderingContext2D = this.canvasE1.nativeElement.getContext('2d', { alpha: false });

    this.audioMainTheme.nativeElement.play();

    this.level1 = new Level ({ 
      context: ctx, 
      image:        this.imgBackground1_1.nativeElement,
      sourceWidth:  this.canvasE1.nativeElement.width, 
      sourceHeight: this.canvasE1.nativeElement.height,
      frameWidth:   this.canvasE1.nativeElement.width, 
      frameHeight:  this.canvasE1.nativeElement.height,
      character:    new Character({ context: ctx, x: Constants.CHAR_X_POS, y: Constants.CHAR_Y_POS, canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })
    });

    this.level1.addEnemy(
      new Enemy({ context: ctx, x: Constants.CHAR_X_POS + 600, y: 0, moveLeft: true })
    );

    for (var i=0; i<100; i++){
      // if (i != 63 && i != 25 && i != 26 && i != 27){
        this.level1.addTerras([ new Terra({ context: ctx, x: i * Constants.BLOCK_WIDTH, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT }) ]);
        // this.level1.addTerras([ new Terra({ context: ctx, x: i * Constants.BLOCK_WIDTH, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT }) ]);
      // }
    }
    // this.level1.addTerras(
    //   [
    //   new Terra({ context: ctx, x: 0, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 2, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 3, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 4, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 4, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 5, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 6, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 7, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 8, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 9, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: Constants.BLOCK_WIDTH * 10, y: Constants.CANVAS_HEIGHT - Constants.TERRA_HEIGHT })
    //   , new Terra({ context: ctx, x: 4069, y: 650, frameWidth: 850, frameHeight: 1 })
    //   , new Terra({ context: ctx, x: 5098, y: 650, frameWidth: 850, frameHeight: 1 })
    //   , new Terra({ context: ctx, x: 5948, y: 650, frameWidth: 3200, frameHeight: 1 })
    // ]
    // );

    this.level1.addPipes([
        new StandPipe({ context: ctx, x: 1595, y: 598 })  //y-coordinate is the top most edge
      , new StandPipe({ context: ctx, x: 2170, y: 552 })  //x-coordinate is the left most edge
      , new StandPipe({ context: ctx, x: 2630, y: 552 })
      , new StandPipe({ context: ctx, x: 3245, y: 552 })
    ]);

    this.level1.addBlocks([
      new MysteryBlock({ context: ctx, x: 914,  y: Constants.PLATFORM_1_Y }) //484
      , new BrickBlock({ context: ctx, x: 1141,  y: Constants.PLATFORM_1_Y })
      , new BrickBlock({ context: ctx, x: 1141 + Constants.BLOCK_WIDTH * 2,  y: Constants.PLATFORM_1_Y })
      , new BrickBlock({ context: ctx, x: 1141 + Constants.BLOCK_WIDTH * 4,  y: Constants.PLATFORM_1_Y })
      , new MysteryBlock({ context: ctx, x: 1141 + Constants.BLOCK_WIDTH,  y: Constants.PLATFORM_1_Y })
      , new MysteryBlock({ context: ctx, x: 1141 + Constants.BLOCK_WIDTH * 3,  y: Constants.PLATFORM_1_Y })
      , new MysteryBlock({ context: ctx, x: 1141 + Constants.BLOCK_WIDTH * 2,  y: Constants.PLATFORM_2_Y })
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
    if ((event.type == "keydown") && (event.keyCode == KEY_CODE.SPACE)){
      this.audioJump.nativeElement.play();
    }
    this.level1.handleKeyboardEvent(event);
  }
}