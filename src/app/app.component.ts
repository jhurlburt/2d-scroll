import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, HostListener } from '@angular/core';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  SPACE = 32,
  CHAR_A = 65,
  CHAR_D = 68
}
export enum ACTION {
  STAND_LEFT,
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
const MAX_JUMP: number = HEIGHT * 5;
const CHAR_TPF: number = 18;
const MYSTERY_TPF: number = 30;
const CANVAS_HEIGHT: number = 800;
const CANVAS_WIDTH: number = 1200;
const PLATFORM_HEIGHT_1: number = 484;
const PLATFORM_HEIGHT_2: number = PLATFORM_HEIGHT_1 - 228;
const MYSTERY_WIDTH: number = 58;
const MYSTERY_HEIGHT: number = 58;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
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

  title = 'Super Mario Brothers';
  key_walk_left: boolean = false;
  key_walk_right: boolean = false;
  key_jump: boolean = false;
  isdrawing = false;
  bg: Background;
  mario: Character;
  blocks: BoundingBox[];
  pipes: BoundingBox[];
  collided: BoundingBox[];
  // helper: Helper;

  constructor() {
  }

  gameLoop() {
    console.log("gameLoop()");

    setInterval(() => {
      if (!this.isdrawing) {
        //Set isDrawing (thread contention prevention)
        this.isdrawing = true;
        this.collided = []; //reset

        var vert = (this.key_jump && !this.mario.isFalling) ? this.bg.canScrollUp() : this.bg.canScrollDown(),
          scroll = (this.key_walk_right) ? this.bg.canScrollRight() : (this.key_walk_left) ? this.bg.canScrollLeft() : 0;
          
        this.blocks.forEach(element => {
          if (Helper.collideWithBoundingBox1a(this.mario, [ element ], vert, scroll)) {
            this.collided.push( element );
            return;
          }
        });
        this.pipes.forEach(element => {
          if (Helper.collideWithBoundingBox1a(this.mario, [ element ], vert, scroll)) {
            this.collided.push( element );
            return;
          }
        });
        
        this.mario.isFalling = false;
        if (vert < 0) {                     //IS JUMPING
          if (this.collided.length > 0) {   //IS COLLIDED
            this.mario.isFalling = true;    //IS FALLING
            vert = scroll = 0;
          }
        } else if (vert >= 0) {             //IS FALLIN
          if (this.collided.length > 0){    //IS COLLIDED
            this.bg.setPlatform();          //SET PLATFORM

            console.log("this.bg.platform_y: " + this.bg.platform_y);
            console.log("this.collided[0].boundingBox.y: " + this.collided[0].boundingBox.y); 
            console.log("this.collided[0].boundingBox.frameHeight: " + this.collided[0].boundingBox.frameHeight); 
            console.log("this.mario.boundingBox.y: " + (this.mario.boundingBox.y)); 
            console.log("this.mario.boundingBox.frameHeight: " + (this.mario.boundingBox.frameHeight)); 
            // if (this.collided[0].boundingBox.y - this.collided[0].boundingBox.frameHeight > this.mario.boundingBox.y) {
            //     scroll = 0;
            // }
            if (this.collided[0].boundingBox.y == this.mario.boundingBox.y) {
                scroll = 0;
            }
          } else {
            this.bg.clearPlatform();        //CLEAR PLATFORM
          }
          console.log("vert:" + vert);
          //this.level1.sourceY + vert > this.platform_y ? Math.abs(this.level1.sourceY - this.platform_y) : vert;
          vert = this.bg.canScrollDown();
          this.mario.isFalling = !(vert == 0);
        }        

        //Get NEW MARIO ACTION & UPDATE MARIO SPRITE ANIMATION
        this.mario.update(Helper.getAction(this.mario.lastAction, vert, scroll));
        //UPDATE FG/BG
        this.blocks.forEach(element => {          
          element.update(0 - scroll, 0 - vert, this.bg.platform_y); //FG elements move opposite the BG element
        });
        this.pipes.forEach(element => {
          element.update(0 - scroll, 0 - vert, this.bg.platform_y); //FG elements should move opposite the BG element
        });
        this.bg.update(scroll, vert);

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

  afterLoading() {
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
      images: [this.imgBackground1_1.nativeElement],
      sourceWidth: this.canvasE1.nativeElement.width,
      sourceHeight: this.canvasE1.nativeElement.height,
      frameWidth: this.canvasE1.nativeElement.width,
      frameHeight: this.canvasE1.nativeElement.height,
    });

    //614 - H = Y
    this.pipes = [
      new StandPipe({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [ null ],
        x: 1595, //1595
        y: 650, //598
        sourceWidth: 120,
        sourceHeight: 115,
        frameWidth: 120,
        frameHeight: 115
      })
    ];

    this.blocks = [
      new Block({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [this.imgBlock.nativeElement],
        x: 914
      }),
      new Block({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [this.imgBrick.nativeElement],
        x: 1141
      }),
      new Block({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [this.imgBlock.nativeElement],
        x: 1141 + MYSTERY_WIDTH
      }),
      new Block({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [this.imgBrick.nativeElement],
        x: 1141 + MYSTERY_WIDTH * 2
      }),
      new Block({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [this.imgBlock.nativeElement],
        x: 1141 + MYSTERY_WIDTH * 3
      }),
      new Block({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [this.imgBrick.nativeElement],
        x: 1141 + MYSTERY_WIDTH * 4
      }),
      new Block({
        context: this.canvasE1.nativeElement.getContext('2d'),
        images: [this.imgBlock.nativeElement],
        x: 1141 + MYSTERY_WIDTH * 2, //x: 913,
        y: PLATFORM_HEIGHT_2
      })
    ];
    this.collided = [];

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

interface BoundingBox {
  boundingBox: Sprite;
  platform_y: number;
  id: string;
  name: string;
  hasCollidedTop: boolean;
  hasCollidedBottom: boolean;
  hasCollidedLeft: boolean;
  hasCollidedRight: boolean;
  collisionObjectName: string;
  collisionObjectId: number;

  update(hor: number, vert: number, platform_y: number): void;
  render(): void;
  hasCollided(): boolean;
  resetCollided(): void;
}

class StandPipe implements BoundingBox {
  boundingBox: Sprite;
  platform_y: number;
  id: string;
  name: string = "StandPipe";
  hasCollidedTop: boolean = false;
  hasCollidedBottom: boolean = false;
  hasCollidedLeft: boolean = false;
  hasCollidedRight: boolean = false;
  collisionObjectName: string = "";
  collisionObjectId: number = 0;

  constructor(options) {
    this.boundingBox = new Sprite({
      context: options.context,
      image: options.images[0],
      x: options.x,
      y: options.y,
      ticksPerFrame: options.ticksPerFrame,
      sourceWidth: options.sourceWidth,
      sourceHeight: options.sourceHeight,
      frameWidth: options.frameWidth,
      frameHeight: options.frameHeight,
      numberOfFrames: 1
    });
    this.id = Helper.newGuid();
  }

  toString = function () {
    var result = "";
    if (this.boundingBox != null) {
      result = this.boundingBox.toString();
    }
    return result;
  };
  update = function (hor: number, vert: number, platform_y: number = 0) {
    this.platform_y = platform_y;
    this.boundingBox.x += hor;
    this.boundingBox.y += vert;
    this.boundingBox.update();
  };
  render = function () {
    this.boundingBox.render();
  };
  hasCollided = function() {
    return this.hasCollidedBottom || this.hasCollidedTop || this.hasCollidedLeft || this.hasCollidedRight;
  };
  resetCollided = function() {
    this.hasCollidedBottom = false;
    this.hasCollidedTop = false;
    this.hasCollidedLeft = false;
    this.hasCollidedRight = false;
  };

}
class Background {
  level1: Sprite;
  isFalling: boolean = false;
  helper: Helper;
  platform_y: number = 0;
  hasCollided: boolean = false;

  constructor(options) {
    this.level1 = new Sprite({
      context: options.context,
      image: options.images[0],
      x: options.x,
      y: options.y,
      sourceWidth: options.sourceWidth,
      sourceHeight: options.sourceHeight,
      frameWidth: options.frameWidth,
      frameHeight: options.frameHeight,
      numberOfFrames: Math.trunc(options.images[0] / options.frameWidth)
    });
  }
  canScrollRight = function () {
    // return (this.level1.sourceX < (this.level1.image.width - this.level1.frameWidth));
    var rightEdge = this.level1.image.width - this.level1.frameWidth;
    return this.level1.sourceX + WALK_SPEED > rightEdge ?
      rightEdge - this.level1.sourceX : WALK_SPEED;
  };
  canScrollLeft = function () {
    return WALK_SPEED > this.level1.sourceX ? 0 - this.level1.sourceX : 0 - WALK_SPEED;
  };
  canScrollUp = function (vert: number = JUMP_SPEED,  max: number = MAX_JUMP) {
    var topEdge = this.platform_y - max;
    var vert = this.level1.sourceY - vert < topEdge ? topEdge - this.level1.sourceY : 0 - vert;
    return vert;
  };
  canScrollDown = function (vert: number = FALL_SPEED) {
    return this.level1.sourceY + vert > this.platform_y ? Math.abs(this.level1.sourceY - this.platform_y) : vert;
  };
  setPlatform = function () {
    this.platform_y = this.level1.sourceY;
  };
  clearPlatform = function () {
    this.platform_y = 0;
  };
  update = function (scroll: number, vert: number) {
    this.level1.sourceX += scroll;
    this.level1.sourceY += vert;
  };
  render = function () {
    this.level1.render();
  };
}

class Block implements BoundingBox {
  boundingBox: Sprite;
  lastAction: ACTION.STAND_RIGHT;
  originalY: number;
  platform_y: number;
  id: string;
  name: string = "Block";
  hasCollidedTop: boolean = false;
  hasCollidedBottom: boolean = false;
  hasCollidedLeft: boolean = false;
  hasCollidedRight: boolean = false;
  collisionObjectName: string = "";
  collisionObjectId: number = 0;

  constructor(options) {
    this.boundingBox = new Sprite({
      context: options.context,
      image: options.images[0],
      x: options.x,
      y: options.y || PLATFORM_HEIGHT_1,
      ticksPerFrame: options.ticksPerFrame || MYSTERY_TPF,
      sourceWidth: options.sourceWidth || MYSTERY_WIDTH,
      sourceHeight: options.sourceHeight || MYSTERY_HEIGHT,
      frameWidth: options.frameWidth || MYSTERY_WIDTH,
      frameHeight: options.frameHeight || MYSTERY_HEIGHT
    });
    this.originalY = options.y;
    this.id = Helper.newGuid();
  }

  toString = function () {
    var result = "";
    if (this.boundingBox != null) {
      result = this.boundingBox.toString();
    }
    return result;
  };
  update = function (hor: number, vert: number, platform_y: number) {
    // this.boundingBox = this.myBlock;
    this.platform_y = platform_y;
    this.boundingBox.x += hor;
    this.boundingBox.y += vert;
    this.boundingBox.update();
  };
  render = function () {
    this.boundingBox.render();
  };
  hasCollided = function() {
    return this.hasCollidedBottom || this.hasCollidedTop || this.hasCollidedLeft || this.hasCollidedRight;
  };
  resetCollided = function() {
    this.hasCollidedBottom = false;
    this.hasCollidedTop = false;
    this.hasCollidedLeft = false;
    this.hasCollidedRight = false;
  };
}

class Helper {

  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };  
  static getAction = function (lastAction: ACTION = ACTION.STAND_RIGHT, vert: number = 0, scroll: number = 0) {

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

  static collideWithBoundingBox1 = function (char: Character, blocks: BoundingBox[], vert: number = 0, scroll: number = 0) {
    var hasCollided = false,
        hasCollidedX = false,
        hasCollidedY = false;

    if (char != null) {
      var obj1: Sprite = char.boundingBox;

      blocks.forEach(element => {
        var obj2: Sprite = element.boundingBox,
          char_top = obj1.y - obj1.frameHeight,
          char_bot = obj1.y,
          char_rt = obj1.x + obj1.frameWidth,
          char_lt = obj1.x,
          block_top = obj2.y - obj2.frameHeight,
          block_bot = obj2.y,
          block_rt = obj2.x + obj2.frameWidth,
          block_lt = obj2.x;
  
        // console.log("horizontal collision");
        if (((char_rt >= block_lt) && (char_lt < block_rt)) ||
            ((char_lt <= block_rt) && (char_rt > block_rt))) {

          // console.log("vertical collision");
          if (vert < 0) {
            // if ((char_top - JUMP_SPEED <= block_bot) && (char_bot > block_bot)) {
            if ((char_top + vert <= block_bot) && (char_bot > block_bot)) {
              // console.log(char_top+":"+block_bot+":"+JUMP_SPEED);
              hasCollided = true;
            }
          } else {
            //400 + 4 >= 400 && 350 < 400
            // if ((char_bot + FALL_SPEED >= block_top) && (char_top < block_top)) {
            if ((char_bot + vert >= block_top) && (char_top < block_top)) {
              hasCollided = true;
            }
          }
        }
        // hasCollidedX = ((char_rt + scroll > block_lt) && (char_lt < block_lt)) ||
        //                 ((char_lt + scroll < block_rt) && (char_rt > block_rt));
        // if (scroll >= 0){            
        //   hasCollidedX = ((char_rt + scroll > block_lt) && (char_lt < block_lt));//Detect collision - CHAR RT SIDE
        // } else if (scroll < 0){            
        //   hasCollidedX = ((char_lt + scroll < block_rt) && (char_rt > block_rt));//Detect collision - CHAR LT SIDE
        // }
        // hasCollidedY = ((char_bot + vert > block_top) && (char_top < block_top)) ||
        //                 ((char_top + vert < block_bot) && (char_bot > block_bot));
        // if (vert >= 0) {
        //   hasCollidedY = ((char_bot + vert > block_top) && (char_top < block_bot));//Detect collision - CHAR BOT SIDE
        // } else if (vert < 0) {
        //   hasCollidedY = ((char_top + vert < block_bot) && (char_bot > block_top));//Detect collision - CHAR TOP SIDE
        // }
      });
    }
    return hasCollided;
  };

  static collideWithBoundingBox1a = function (char: Character, objects: BoundingBox[], vert: number = 0, scroll: number = 0) {
    var hasCollided = false,
        hasCollidedTop = false,
        hasCollidedBot = false,
        hasCollidedLt = false,
        hasCollidedRt = false;
    
    if (char != null) {
      var obj1: Sprite = char.boundingBox,
        char_top = obj1.y - obj1.frameHeight,
        char_bot = obj1.y,
        char_rt = obj1.x + obj1.frameWidth,
        char_lt = obj1.x;

      objects.forEach(element => {
        hasCollidedTop = false;        
        hasCollidedBot = false;        
        hasCollidedLt = false;
        hasCollidedRt = false;

        if (!hasCollided){
          var obj2: Sprite = element.boundingBox,
            block_top = obj2.y - obj2.frameHeight,
            block_bot = obj2.y,
            block_rt = obj2.x + obj2.frameWidth,
            block_lt = obj2.x;

          //Assumption: 2 bounding boxes CANNOT occupy the same space
          // if (element.name == "StandPipe"){
          //   console.log("vert " + vert); //0
          //   console.log("char_top " + char_top); //586 - (-3) IS char_top - vert < block_bot = YES
          //   console.log("char_bot " + char_bot); //650        IS char_bot > block_top = YES
          //   console.log("char_rt " + char_rt); //264
          //   console.log("char_lt " + char_lt); //200
          //   console.log("block_top " + block_top); //535, 612
          //   console.log("block_bot " + block_bot); //650, 670
          //   console.log("block_rt " + block_rt); //321, 719
          //   console.log("block_lt " + block_lt); //201, 661  
          // }  

          if (((char_rt + scroll > block_lt) && (char_rt + scroll < block_rt))) {
              hasCollidedLt = true;
              element.hasCollidedLeft = true;
          }
          if (((char_lt + scroll < block_rt) && (char_lt + scroll > block_lt))) {
              hasCollidedRt = true;
              element.hasCollidedRight = true;
          }
          // console.log("vertical collision");
          if (vert < 0) {
            if ((char_top + vert <= block_bot) && (char_top + vert >= block_bot)) {
              hasCollidedBot = true;
              element.hasCollidedBottom = true;
            }
          } else {
            if ((char_bot + vert >= block_top) && (char_bot + vert <= block_bot)) {
              hasCollidedTop = true;
              element.hasCollidedTop = true;

              // if (element.name == "StandPipe"){
              //   console.log("vert " + vert); //0
              //   console.log("char_top " + char_top); //586 - (-3) IS char_top - vert < block_bot = YES
              //   console.log("char_bot " + char_bot); //650        IS char_bot > block_top = YES
              //   console.log("char_rt " + char_rt); //264
              //   console.log("char_lt " + char_lt); //200
              //   console.log("block_top " + block_top); //535, 612
              //   console.log("block_bot " + block_bot); //650, 670
              //   console.log("block_rt " + block_rt); //321, 719
              //   console.log("block_lt " + block_lt); //201, 661  
              // }  

            }
          } 
          hasCollided = (hasCollidedTop || hasCollidedBot) && (hasCollidedLt || hasCollidedRt);
        } 

        // if (vert > 0 && ((char_bot + vert >= block_top) && (char_bot + vert < block_bot))) {
        //   hasCollidedY = true;

        // } else if (vert <= 0 && ((char_top + vert <= block_bot) && (char_top + vert > block_top))) {
        //   hasCollidedY = true;
        // }
      });
    }
    // return {hasCollidedX: hasCollidedX, hasCollidedY: hasCollidedY};
    return hasCollided;
  };

  static collideWithBoundingBox2 = function (char: Character, objects: BoundingBox[], vert: number = 0, scroll: number = 0) {
    var hasCollidedX = false,
        hasCollidedY = false;
    
    if (char != null) {
      var obj1: Sprite = char.boundingBox;

      objects.forEach(element => {
        var obj2: Sprite = element.boundingBox,
        char_top = obj1.y - obj1.frameHeight,
        char_bot = obj1.y,
        char_rt = obj1.x + obj1.frameWidth,
        char_lt = obj1.x,
        block_top = obj2.y - obj2.frameHeight,
        block_bot = obj2.y,
        block_rt = obj2.x + obj2.frameWidth,
        block_lt = obj2.x;

        //Assumption: 2 bounding boxes CANNOT occupy the same space

        if (scroll >= 0){            
          hasCollidedX = ((char_rt + scroll > block_lt) && (char_lt < block_lt));//Detect collision - CHAR RT SIDE
        } else if (scroll < 0){            
          hasCollidedX = ((char_lt - scroll < block_rt) && (char_rt > block_rt));//Detect collision - CHAR LT SIDE
        }
        if (vert >= 0) {
          hasCollidedY = ((char_bot + vert > block_top) && (char_top < block_bot));//Detect collision - CHAR BOT SIDE
        } else if (vert < 0) {
          hasCollidedY = ((char_top + vert < block_bot) && (char_bot > block_top));//Detect collision - CHAR TOP SIDE

          // var isDebugging = true;
          // if (isDebugging && (hasCollidedY || hasCollidedX)){

          //   console.log("hasCollidedY " + hasCollidedY); //false
          //   console.log("hasCollidedX " + hasCollidedX); //true

          //   console.log("vert " + vert); //0
          //   console.log("char_top " + char_top); //586 - (-3) IS char_top - vert < block_bot = YES
          //   console.log("char_bot " + char_bot); //650        IS char_bot > block_top = YES
          //   console.log("char_rt " + char_rt); //264
          //   console.log("char_lt " + char_lt); //200

          //   console.log("block_top " + block_top); //535, 612
          //   console.log("block_bot " + block_bot); //650, 670
          //   console.log("block_rt " + block_rt); //321, 719
          //   console.log("block_lt " + block_lt); //201, 661

          // }
        }
        // var isDebugging = true;
        // if (isDebugging && (hasCollidedY || hasCollidedX)){

        //   // if ((char_top - JUMP_SPEED <= block_bot) && (char_bot > block_bot)) {
        //   //   // console.log(char_top+":"+block_bot+":"+JUMP_SPEED);
        //   //   hasCollided = true;
        //   // }


        //   isDebugging = false;
        //   console.log("hasCollidedY " + hasCollidedY); //false
        //   console.log("hasCollidedX " + hasCollidedX); //true

        //   console.log("vert " + vert); //0
        //   console.log("char_top " + char_top); //586 - (-3) IS char_top - vert < block_bot = YES
        //   console.log("char_bot " + char_bot); //650        IS char_bot > block_top = YES
        //   console.log("char_rt " + char_rt); //264
        //   console.log("char_lt " + char_lt); //200

        //   console.log("block_top " + block_top); //535, 612
        //   console.log("block_bot " + block_bot); //650, 670
        //   console.log("block_rt " + block_rt); //321, 719
        //   console.log("block_lt " + block_lt); //201, 661
        // }
      });
    }
    return { 
      hasCollidedX: hasCollidedX, 
      hasCollidedY: hasCollidedY 
    };
  };

}

class Character implements BoundingBox {
  marios: Sprite[];
  boundingBox: Sprite;
  lastAction: ACTION = ACTION.STAND_RIGHT;
  isFalling: boolean = false;
  id: string;
  name: string = "Character";
  platform_y: number;
  hasCollidedTop: boolean = false;
  hasCollidedBottom: boolean = false;
  hasCollidedLeft: boolean = false;
  hasCollidedRight: boolean = false;
  collisionObjectName: string = "";
  collisionObjectId: number = 0;

  constructor(options) {
    this.marios = [
      new Sprite({
        context: options.context, image: options.images[0], x: options.x, y: options.y,
        sourceWidth: options.sourceWidth,
        sourceHeight: options.sourceHeight,
        frameWidth: options.frameWidth,
        frameHeight: options.frameHeight
      }),
      new Sprite({
        context: options.context, image: options.images[1], x: options.x, y: options.y,
        sourceWidth: options.sourceWidth,
        sourceHeight: options.sourceHeight,
        frameWidth: options.frameWidth,
        frameHeight: options.frameHeight
      }),
      new Sprite({
        context: options.context, image: options.images[2], x: options.x, y: options.y,
        ticksPerFrame: CHAR_TPF,
        sourceWidth: options.sourceWidth || WIDTH,
        sourceHeight: options.sourceHeight || HEIGHT,
        frameWidth: options.frameWidth || WIDTH,
        frameHeight: options.frameHeight || HEIGHT
      }),
      new Sprite({
        context: options.context, image: options.images[3], x: options.x, y: options.y,
        ticksPerFrame: CHAR_TPF,
        sourceWidth: options.sourceWidth || WIDTH,
        sourceHeight: options.sourceHeight || HEIGHT,
        frameWidth: options.frameWidth || WIDTH,
        frameHeight: options.frameHeight || HEIGHT
      }),
      new Sprite({
        context: options.context, image: options.images[4], x: options.x, y: options.y,
        sourceWidth: options.sourceWidth,
        sourceHeight: options.sourceHeight,
        frameWidth: options.frameWidth,
        frameHeight: options.frameHeight
      }),
      new Sprite({
        context: options.context, image: options.images[5], x: options.x, y: options.y,
        sourceWidth: options.sourceWidth,
        sourceHeight: options.sourceHeight,
        frameWidth: options.frameWidth,
        frameHeight: options.frameHeight
      })
    ];
    this.boundingBox = this.marios[ACTION.STAND_RIGHT];
    this.id = Helper.newGuid();
  }

  toString = function () {
    if (this.boundingBox != null) {
      return this.boundingBox.toString();
    }
    return "";
  };

  isJumping = function () {
    return (this.lastAction == ACTION.JUMP_LEFT ||
      this.lastAction == ACTION.JUMP_RIGHT ||
      this.lastAction == ACTION.JUMP) && !this.isFalling;
  };

  update = function (action: ACTION = ACTION.STAND_RIGHT) {
    switch (action) {
      case ACTION.WALK_LEFT: {
        this.boundingBox = this.marios[ACTION.WALK_LEFT];
        break;
      } case ACTION.WALK_RIGHT: {
        this.boundingBox = this.marios[ACTION.WALK_RIGHT];
        break;
      } case ACTION.STAND_LEFT: {
        this.boundingBox = this.marios[ACTION.STAND_LEFT];
        break;
      } case ACTION.STAND_RIGHT: {
        this.boundingBox = this.marios[ACTION.STAND_RIGHT];
        break;
      } case ACTION.JUMP_LEFT: {
        this.boundingBox = this.marios[ACTION.JUMP_LEFT];
        break;
      } case ACTION.JUMP_RIGHT: {
        this.boundingBox = this.marios[ACTION.JUMP_RIGHT];
        break;
      } case ACTION.JUMP: {
        this.boundingBox = (this.lastAction == ACTION.STAND_LEFT) ? this.marios[ACTION.JUMP_LEFT] : this.marios[ACTION.JUMP_RIGHT];
        break;
      } default: {
        console.log("switch (action) == default");
        break;
      }
    }
    this.lastAction = action;
    this.boundingBox.update();
  };
  render = function () {
    this.boundingBox.render();
  };
  hasCollided = function() {
    return this.hasCollidedBottom || this.hasCollidedTop || this.hasCollidedLeft || this.hasCollidedRight;
  };
  resetCollided = function() {
    this.hasCollidedBottom = false;
    this.hasCollidedTop = false;
    this.hasCollidedLeft = false;
    this.hasCollidedRight = false;
  };


}

class Sprite {
  context: CanvasRenderingContext2D;
  image: HTMLImageElement;
  numberOfFrames: number = 1;
  frameIndex: number = 0;
  ticksPerFrame: number = 0;
  tickCount: number = 0;
  x: number = 0;
  y: number = 0;
  frameWidth: number = 0;
  frameHeight: number = 0;
  sourceWidth: number = 0;
  sourceHeight: number = 0;
  sourceX: number = 0;
  sourceY: number = 0;

  constructor(options) {
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.context = options.context || null;
    this.image = options.image || null;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.frameWidth = options.frameWidth || options.image.width;
    this.frameHeight = options.frameHeight || options.image.height;
    this.sourceWidth = options.sourceWidth || options.image.width;
    this.sourceHeight = options.sourceHeight || options.image.height;
    this.numberOfFrames = options.numberOfFrames || Math.trunc(options.image.width / options.frameWidth);
  }
  toString = function () {
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