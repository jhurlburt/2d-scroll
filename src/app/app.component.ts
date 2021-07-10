import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Constants } from '../helpers/Constants';
import { Level } from '../models/Level';
import { Character } from '../models/Character';
import { Enemy } from '../models/Enemy';
import { Terra } from '../models/Terra';
import { BrickBlock } from '../models/BrickBlock';
import { MysteryBlock } from '../models/MysteryBlock';
import { KEY_CODE } from '../helpers/Keyboard';
import { ShortPipe } from '../models/ShortPipe';
import { MediumPipe } from 'src/models/MediumPipe';
import { LongPipe } from 'src/models/LongPipe';

const FPS: number = 60; //lowering refresh rate increases game speed
const CANVAS_HEIGHT: number = 800;
const CANVAS_WIDTH: number = 1200;

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
  private imagesLoaded: number = 0;
  private totalImages: number = 5;
  private level1: Level;
  // audioJump: any;
  private audioJumpPlaying: boolean = false;
  private endSequenceTimeout: number = 0;
  private endSequence: boolean = false;
  private isRunning: boolean = false;
  
  private gameLoop() {
    console.log("begin gameLoop()");
    this.init();

    setInterval(() => {
      if (this.endSequence){
        if (!this.isRunning){
          this.isRunning = true;
          this.endSequenceTimeout = (this.endSequenceTimeout == 0) ? Date.now() + (1 * 1000) : this.endSequenceTimeout;
          if (Date.now() > this.endSequenceTimeout){
            this.init();
          } 
          this.isRunning = false;  
        }
      } else {
        if (!this.isRunning){
          this.isRunning = true;
          this.level1.checkpointLogic();
          this.level1.update();
          this.level1.render();
          this.isRunning = false;  
        } 
      }
    }, FPS/1000); //30 FPS
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

  private handleTermination(options){
    this.endSequence = true;
  }

  afterLoading() {
    if (++this.imagesLoaded == this.totalImages) { 
      // this.init(); 
      this.gameLoop();
    }
  }

  init(): void{
    console.log("begin allImagesLoaded()");
    this.canvasE1.nativeElement.height = CANVAS_HEIGHT;
    this.canvasE1.nativeElement.width = CANVAS_WIDTH;
    let ctx: CanvasRenderingContext2D = this.canvasE1.nativeElement.getContext('2d', { alpha: false });
    this.endSequenceTimeout = 0;
    this.endSequence = false;

    this.audioMainTheme.nativeElement.play();

    this.level1 = new Level ({ 
      context: ctx, 
      image:        this.imgBackground1_1.nativeElement,
      sourceWidth:  this.canvasE1.nativeElement.width, 
      sourceHeight: this.canvasE1.nativeElement.height,
      frameWidth:   this.canvasE1.nativeElement.width, 
      frameHeight:  this.canvasE1.nativeElement.height,
      character:    new Character({ context: ctx, canvasWidth: this.canvasE1.nativeElement.width, canvasHeight: this.canvasE1.nativeElement.height })
    });

    for (var i=0; i<100; i++){
      this.level1.addTerras([ 
        new Terra({ context: ctx, x: i * Terra.WIDTH, y: CANVAS_HEIGHT - Terra.HEIGHT }) ]);
    }

    this.level1.addPipes([
      new ShortPipe({ context: ctx, x: 1595 })  //y-coordinate is the top most edge
      , new MediumPipe({ context: ctx, x: 2170 })  //x-coordinate is the left most edge
      , new LongPipe({ context: ctx, x: 2628 })
      , new LongPipe({ context: ctx, x: 3245 })
    ]);

    this.level1.addBlocks([
      new MysteryBlock({ context: ctx, x: 914 }) //484
      , new BrickBlock({ context: ctx, x: 1141 })
      , new BrickBlock({ context: ctx, x: 1141 + BrickBlock.WIDTH * 2 })
      , new BrickBlock({ context: ctx, x: 1141 + BrickBlock.WIDTH * 4 })
      , new MysteryBlock({ context: ctx, x: 1141 + MysteryBlock.WIDTH })
      , new MysteryBlock({ context: ctx, x: 1141 + MysteryBlock.WIDTH * 3 })
      , new MysteryBlock({ context: ctx, x: 1141 + MysteryBlock.WIDTH * 2,  y: MysteryBlock.PLATFORM_2_Y })
    ]);
    
    this.level1.notifyParent.subscribe((options) => {
      console.log("Name: " + options.name);
      if (options.name == "Checkpoint"){
        this.handleCheckpoint(options);
      } else if (options.name == "Termination"){
        this.handleTermination(options);
      }
    });
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