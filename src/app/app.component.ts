import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { Constants } from './helpers/Constants';
import { BoundingBox } from './interface/BoundingBox';
import { Helper } from './helpers/Helper';
import { Background } from './models/Background';
import { Character } from './models/Character';
import { StandPipe } from './models/StandPipe';
import { Enemy } from './models/Enemy';
import { Block } from './models/Block';
import { KEY_CODE } from './helpers/Keyboard';

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
  key_walk_left: boolean = false;
  key_walk_right: boolean = false;
  key_jump: boolean = false;
  isdrawing: boolean = false;
  bg: Background;
  mario: Character;
  enemies: BoundingBox[];
  blocks: BoundingBox[];
  pipes: BoundingBox[];

  constructor() {
  }

  private gameLoop() {
    setInterval(() => {
      if (!this.isdrawing) {

        //Set isDrawing (thread contention prevention)
        this.isdrawing = true;

        //First, determine if character can move within the constraints of the background        
        var vert: number = (this.key_jump && !this.mario.isFalling) ? this.bg.canScrollUp() : this.bg.canScrollDown(),
          scroll: number = (this.key_walk_right) ? this.bg.canScrollRight() : (this.key_walk_left) ? this.bg.canScrollLeft() : 0;

        var collided: BoundingBox[] = this.getCollided(vert, scroll);                
     
        //Character is falling if:
        //1. Is ascending (jumping) and has collided with an element
        //2. Is descending
        this.mario.isFalling = false;
        
        //Next, determine if character is ascending, descending or neither        
        if (vert < 0) {                     //IS JUMPING          
          if (collided.length > 0) {        //IS COLLIDED
            collided.forEach(element => {
              var counter = 0;
              while ((counter >= vert) && !hasCollided) {
                var hasCollided = Helper.collideWithBox(this.mario, [ element ], counter, scroll);
                if (!hasCollided) counter--;
              }
              vert = counter;               //IS ACCURATE VERT
            });
            this.mario.isFalling = true;    //IS FALLING
          }
        } else if (vert >= 0) {             //IS FALLING
          if (collided.length > 0){         //IS COLLIDED
            collided.forEach(element => {
              var counter = 0;
              while ((counter <= vert) && !hasCollided){
                var hasCollided = Helper.collideWithBox(this.mario, [ element ], counter, scroll);
                if (!hasCollided) counter++;
              }
              vert = counter;               //IS ACCURATE VERT
            });            
            this.bg.setPlatform();          //SET PLATFORM
            //TODO: Compare box to mario (top AND bottom and inbetween) 
            //Make incremental checks to get an accurate number
            //If collided then step scroll = 0
            if (collided[0].boundingBox.y == this.mario.boundingBox.y) {
                scroll = 0;                 //IS COLLIDED, STOP SCROLLING
            }
          } else {
            this.bg.clearPlatform();        //CLEAR PLATFORM
          }
          this.mario.isFalling = !(vert == 0);
        }        
        //Next, update all elements
        this.update(vert, scroll);
        //Next, render all elements
        this.render();
        //Next, stop drawing
        this.isdrawing = false;
      }
    }, Constants.REFRESH);
  }

  private getCollided(vert: number, scroll: number){
    var collided: BoundingBox[] = [];
    //Next, determine if character will collide with any elements; add elements to array
    this.blocks.forEach(element => {
      if (Helper.collideWithBox(this.mario, [ element ], vert, scroll)) {
        collided.push( element );
        return;
      }
    });
    this.pipes.forEach(element => {
      if (Helper.collideWithBox(this.mario, [ element ], vert, scroll)) {
        collided.push( element );
        return;
      }
    });
    return collided;
  }

  private update(vert: number, scroll: number){
    //Get NEW MARIO ACTION & UPDATE MARIO SPRITE ANIMATION
    this.mario.update(Helper.getAction(this.mario.lastAction, vert, scroll));

    this.enemies.forEach(element => {          
      element.update(0 - scroll, 0 - vert, this.bg.platform_y); //FG elements move opposite the BG element
    });
    //UPDATE FG/BG
    this.blocks.forEach(element => {          
      element.update(0 - scroll, 0 - vert, this.bg.platform_y); //FG elements move opposite the BG element
    });
    this.pipes.forEach(element => {
      element.update(0 - scroll, 0 - vert, this.bg.platform_y); //FG elements should move opposite the BG element
    });
    this.bg.update(scroll, vert);
  }

  private render() {
    //RENDER ALL, FROM BACK TO FRONT
    this.bg.render();
    this.blocks.forEach(element => {
      element.render();
    });
    this.enemies.forEach(element => {          
      element.render();
    });
    this.mario.render();
  }

  ngOnInit() {
    //Do nothing
  }

  afterLoading() {
    //Don't begin the loop until MARIO arrives to the party
    console.log("this.gameLoop()");
    this.gameLoop();
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit()");

    this.canvasE1.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.canvasE1.nativeElement.width = Constants.CANVAS_WIDTH;
    this.mario = new Character({ context: this.canvasE1.nativeElement.getContext('2d'), images: [ 
        this.imgMarioStillLt.nativeElement, this.imgMarioStillRt.nativeElement,
        this.imgMarioWalkLt.nativeElement, this.imgMarioWalkRt.nativeElement,
        this.imgMarioJumpLt.nativeElement, this.imgMarioJumpRt.nativeElement
    ], x: Constants.CHAR_X, y: Constants.CHAR_Y, id: Helper.newGuid() });
    
    this.enemies = [
      new Enemy({ context: this.canvasE1.nativeElement.getContext('2d'), images: [ 
        this.imgMushroomEnemyWalking.nativeElement, this.imgMushroomEnemyWalking.nativeElement ], 
        x: Constants.CHAR_X + 500, y: Constants.CHAR_Y, id: Helper.newGuid() })
    ];

    this.bg = new Background({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBackground1_1.nativeElement],
      sourceWidth: this.canvasE1.nativeElement.width, sourceHeight: this.canvasE1.nativeElement.height,
      frameWidth: this.canvasE1.nativeElement.width, frameHeight: this.canvasE1.nativeElement.height,
    });

    //614 - H = Y
    this.pipes = [
      new StandPipe({ context: this.canvasE1.nativeElement.getContext('2d'), images: [ null ], x: 1595, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 115, id: Helper.newGuid() })
    ];
    
    this.blocks = [
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBrick.nativeElement], name: "Brick", x: 1141, id: Helper.newGuid() }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBrick.nativeElement], name: "Brick", x: 1141 + Constants.BLOCK_WIDTH * 2, id: Helper.newGuid() }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBrick.nativeElement], name: "Brick", x: 1141 + Constants.BLOCK_WIDTH * 4, id: Helper.newGuid() }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 914, id: Helper.newGuid() }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 1141 + Constants.BLOCK_WIDTH, id: Helper.newGuid() }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 1141 + Constants.BLOCK_WIDTH * 3, id: Helper.newGuid() }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 1141 + Constants.BLOCK_WIDTH * 2,  y: Constants.PLATFORM_2_Y, id: Helper.newGuid() })
      ];
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    // console.log("window:keydown => %s", event.keyCode.toString());

    if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D) {
      this.key_walk_right = true;
    } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A) {
      this.key_walk_left = true;
    } else if (event.keyCode == KEY_CODE.SPACE) {
      this.key_jump = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == KEY_CODE.CHAR_D) {
      this.key_walk_right = false;
    } else if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == KEY_CODE.CHAR_A) {
      this.key_walk_left = false;
    } else if (event.keyCode == KEY_CODE.SPACE) {
      this.key_jump = false;
    }
  }
}