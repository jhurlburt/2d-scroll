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

class Constants {
  static readonly REFRESH: number = 5;
  static readonly POSITION_X: number = 200;
  static readonly POSITION_Y: number = 650;
  static readonly WALK_SPEED: number = 2;
  static readonly JUMP_SPEED: number = -3;
  static readonly FALL_SPEED: number = 4;
  static readonly HEIGHT: number = 64;
  static readonly WIDTH: number = 64;
  static readonly MAX_JUMP: number = Constants.HEIGHT * 5;
  static readonly CHAR_TPF: number = 18;
  static readonly MYSTERY_TPF: number = 30;
  static readonly CANVAS_HEIGHT: number = 800;
  static readonly CANVAS_WIDTH: number = 1200;
  static readonly PLATFORM_HEIGHT_1: number = 484;
  static readonly PLATFORM_HEIGHT_2: number = Constants.PLATFORM_HEIGHT_1 - 228;
  static readonly MYSTERY_WIDTH: number = 58;
  static readonly MYSTERY_HEIGHT: number = 58;
}

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
  @ViewChild('imgBlock_hit') imgBlock_hit: ElementRef<HTMLImageElement>;
  @ViewChild('imgBlock_after') imgBlock_after: ElementRef<HTMLImageElement>;
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

  constructor() {
  }

  gameLoop() {
    console.log("gameLoop()");

    setInterval(() => {
      if (!this.isdrawing) {
        //Set isDrawing (thread contention prevention)
        this.isdrawing = true;
        this.collided = [];

        var vert = (this.key_jump && !this.mario.isFalling) ? this.bg.canScrollUp() : this.bg.canScrollDown(),
          scroll = (this.key_walk_right) ? this.bg.canScrollRight() : (this.key_walk_left) ? this.bg.canScrollLeft() : 0;

        this.blocks.forEach(element => {
          if (Helper.collideWithBox(this.mario, [ element ], vert, scroll)) {
            this.collided.push( element );
            return;
          }
        });
        this.pipes.forEach(element => {
          if (Helper.collideWithBox(this.mario, [ element ], vert, scroll)) {
            this.collided.push( element );
            return;
          }
        });
        
        this.mario.isFalling = false;
        
        if (vert < 0) {                     //IS JUMPING          
          if (this.collided.length > 0) {   //IS COLLIDED
            this.collided.forEach(element => {
              var hasCollided = false;
              var counter = 0;
              while ((counter >= vert) && !hasCollided) {
                hasCollided = Helper.collideWithBox(this.mario, [ element ], counter, scroll);
                if (!hasCollided) counter--;
              }
              vert = counter;
            });
            this.mario.isFalling = true;    //IS FALLING
          }

        } else if (vert >= 0) {             //IS FALLING
          if (this.collided.length > 0){    //IS COLLIDED
            this.collided.forEach(element => {
              var hasCollided = false;
              var counter = 0;
              while ((counter <= vert) && !hasCollided){
                hasCollided = Helper.collideWithBox(this.mario, [ element ], counter, scroll);
                if (!hasCollided) counter++;
              }
              vert = counter;
            });            
            this.bg.setPlatform();          //SET PLATFORM
            //TODO: Compare box to mario (top AND bottom and inbetween) 
            if (this.collided[0].boundingBox.y == this.mario.boundingBox.y) {
                scroll = 0;
            }
          } else {
            this.bg.clearPlatform();        //CLEAR PLATFORM
          }
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
    }, Constants.REFRESH);
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

    this.canvasE1.nativeElement.height = Constants.CANVAS_HEIGHT;
    this.canvasE1.nativeElement.width = Constants.CANVAS_WIDTH;

    this.imgBackground1_1.nativeElement.src = "assets/bg-1-1.png";
    this.imgMarioStillLt.nativeElement.src = "assets/mario-still-left.png";
    this.imgMarioStillRt.nativeElement.src = "assets/mario-still-right.png";
    this.imgMarioWalkLt.nativeElement.src = "assets/mario-walking-left.png";
    this.imgMarioWalkRt.nativeElement.src = "assets/mario-walking-right.png";
    this.imgMarioJumpLt.nativeElement.src = "assets/mario-jump-left.png";
    this.imgMarioJumpRt.nativeElement.src = "assets/mario-jump-right.png";
    this.imgBlock.nativeElement.src = "assets/block_flashing_ow.png";
    this.imgBrick.nativeElement.src = "assets/brick-block.png";
    // this.imgBlock_hit.nativeElement.src = "assets/block_hit_ow.png";
    // this.imgBlock_after.nativeElement.src = "assets/block_after_ow.png";

    this.mario = new Character({ context: this.canvasE1.nativeElement.getContext('2d'), images: [ 
        this.imgMarioStillLt.nativeElement, this.imgMarioStillRt.nativeElement,
        this.imgMarioWalkLt.nativeElement, this.imgMarioWalkRt.nativeElement,
        this.imgMarioJumpLt.nativeElement, this.imgMarioJumpRt.nativeElement
      ], x: Constants.POSITION_X, y: Constants.POSITION_Y
    });

    this.bg = new Background({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBackground1_1.nativeElement],
      sourceWidth: this.canvasE1.nativeElement.width, sourceHeight: this.canvasE1.nativeElement.height,
      frameWidth: this.canvasE1.nativeElement.width, frameHeight: this.canvasE1.nativeElement.height,
    });

    //614 - H = Y
    this.pipes = [
      new StandPipe({ context: this.canvasE1.nativeElement.getContext('2d'), images: [ null ], x: 1595, y: 650, sourceWidth: 120, sourceHeight: 115, frameWidth: 120, frameHeight: 115 })
    ];
    this.blocks = [
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBrick.nativeElement], name: "Brick", x: 1141 }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBrick.nativeElement], name: "Brick", x: 1141 + Constants.MYSTERY_WIDTH * 2 }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBrick.nativeElement], name: "Brick", x: 1141 + Constants.MYSTERY_WIDTH * 4 }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 914 }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 1141 + Constants.MYSTERY_WIDTH }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 1141 + Constants.MYSTERY_WIDTH * 3 }),
      new Block({ context: this.canvasE1.nativeElement.getContext('2d'), images: [this.imgBlock.nativeElement, this.imgBlock_hit.nativeElement, this.imgBlock_after.nativeElement], name: "Question", x: 1141 + Constants.MYSTERY_WIDTH * 2,  y: Constants.PLATFORM_HEIGHT_2 })
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
  toString(): string;
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
    return (this.hasCollidedBottom || this.hasCollidedTop) && (this.hasCollidedLeft || this.hasCollidedRight);
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

  canScrollRight = function (scroll: number = Constants.WALK_SPEED) {
    var rightEdge = this.level1.image.width - this.level1.frameWidth;
    return this.level1.sourceX + scroll > rightEdge ? rightEdge - this.level1.sourceX : scroll;
  };

  canScrollLeft = function (scroll: number = 0 - Constants.WALK_SPEED) {
    var leftEdge = 0;
    return this.level1.sourceX + scroll < leftEdge ? leftEdge - this.level1.sourceX : scroll;
  };

  canScrollUp = function (vert: number = Constants.JUMP_SPEED,  max: number = Constants.MAX_JUMP) {
    var topEdge = this.platform_y - max; //-1, -10, -100, -200
    var vert = this.level1.sourceY + vert < topEdge ? this.level1.sourceY - topEdge : vert; //-201 => 
    return vert; 
  };

  canScrollDown = function (vert: number = Constants.FALL_SPEED) {
    var bottomEdge = this.platform_y;
    return this.level1.sourceY + vert > bottomEdge ? this.level1.sourceY - bottomEdge : vert; //-1
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
  platform_y: number;
  id: string;
  name: string;
  hasCollidedTop: boolean = false;
  hasCollidedBottom: boolean = false;
  hasCollidedLeft: boolean = false;
  hasCollidedRight: boolean = false;
  collisionObjectName: string = "";
  collisionObjectId: number = 0;
  step: number = 0;
  offset: number = 0;
  images: HTMLImageElement[];
  canUpdate: boolean = true;

  constructor(options) {
    this.id = Helper.newGuid();
    this.name = options.name || "Block";
    this.images = options.images;
    this.boundingBox = new Sprite({
      context:        options.context,
      image:          options.images[0],
      x:              options.x,
      y:              options.y || Constants.PLATFORM_HEIGHT_1,
      ticksPerFrame:  options.ticksPerFrame || Constants.MYSTERY_TPF,
      sourceWidth:    options.sourceWidth || Constants.MYSTERY_WIDTH,
      sourceHeight:   options.sourceHeight || Constants.MYSTERY_HEIGHT,
      frameWidth:     options.frameWidth || Constants.MYSTERY_WIDTH,
      frameHeight:    options.frameHeight || Constants.MYSTERY_HEIGHT
    });
  }

  toString = function () {
    var result = "";
    if (this.boundingBox != null) {
      result = this.boundingBox.toString();      
    }    
    result = result + ", hasCollidedLeft: " + this.hasCollidedLeft +
      ", hasCollidedRight: " + this.hasCollidedRight +
      ", hasCollidedTop: " + this.hasCollidedTop +
      ", hasCollidedBottom: " + this.hasCollidedBottom;
    return result;
  };

  update = function (hor: number, vert: number, platform_y: number) {
    if ((this.name == "Question") && (this.hasCollided() && this.hasCollidedBottom)) {
      console.log(this.toString());
      this.boundingBox.stopUpdate();
      this.boundingBox.image = this.images[1];

      //TODO: Animate
      //Block types: coin, mushroom
      //If type is coin then animate coin, add to score
      //If type is mushroom then add mushroom to scene
    }
    this.platform_y = platform_y;
    this.boundingBox.x += hor;
    this.boundingBox.y += vert;    
    this.boundingBox.update();
  };

  animate = function () {
    if (this.step == 0){
      this.offset += 10;
      this.step++;
    
    } else if (this.step == 1){
      this.offset += 10;
      this.step++;

    } else if (this.step == 2){
      this.offset += 10;
      this.step++;

    } else if (this.step == 3){
      this.offset -= 10;
      this.step++;

    } else if (this.step == 4){
      this.offset -= 10;
      this.step++;

    } else {
      this.offset -= 10;
      this.step = 0;
    }
  };

  render = function () {
    this.boundingBox.render();
  };

  hasCollided = function() {
    return (this.hasCollidedBottom || this.hasCollidedTop) && (this.hasCollidedLeft || this.hasCollidedRight);
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

  static collideWithBox = function (char: Character, objects: BoundingBox[], vert: number = 0, scroll: number = 0) {
    var hasCollidedAny = false;
    
    if (char != null) {
      var obj1: Sprite = char.boundingBox,
        char_top = obj1.y - obj1.frameHeight,
        char_bot = obj1.y,
        char_rt = obj1.x + obj1.frameWidth,
        char_lt = obj1.x;

      objects.forEach(element => {
        element.resetCollided();

        if (!hasCollidedAny){
          var obj2: Sprite = element.boundingBox,
            block_top = obj2.y - obj2.frameHeight,
            block_bot = obj2.y,
            block_rt = obj2.x + obj2.frameWidth,
            block_lt = obj2.x;

          if (((char_rt + scroll >= block_lt) && (char_lt + scroll < block_rt))) {
            element.hasCollidedLeft = true;

          } else if (((char_lt + scroll <= block_rt) && (char_rt + scroll > block_lt))) {
            element.hasCollidedRight = true;
          }
          if ((char_top + vert <= block_bot) && (char_bot + vert >= block_bot)) {
            element.hasCollidedBottom = true;
            // console.log("element.hasCollidedBottom = true");

          } else if ((char_bot + vert >= block_top) && (char_bot + vert <= block_bot)) {
            element.hasCollidedTop = true;
            // console.log("element.hasCollidedTop = true");
          }
          hasCollidedAny = (element.hasCollidedTop || element.hasCollidedBottom) && (element.hasCollidedLeft || element.hasCollidedRight);
        } 
      });
    }
    return hasCollidedAny;
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
        ticksPerFrame: Constants.CHAR_TPF,
        sourceWidth: options.sourceWidth || Constants.WIDTH,
        sourceHeight: options.sourceHeight || Constants.HEIGHT,
        frameWidth: options.frameWidth || Constants.WIDTH,
        frameHeight: options.frameHeight || Constants.HEIGHT
      }),
      new Sprite({
        context: options.context, image: options.images[3], x: options.x, y: options.y,
        ticksPerFrame: Constants.CHAR_TPF,
        sourceWidth: options.sourceWidth || Constants.WIDTH,
        sourceHeight: options.sourceHeight || Constants.HEIGHT,
        frameWidth: options.frameWidth || Constants.WIDTH,
        frameHeight: options.frameHeight || Constants.HEIGHT
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
    return (this.hasCollidedBottom || this.hasCollidedTop) && (this.hasCollidedLeft || this.hasCollidedRight);
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
    return "x: " + this.x + 
      ", y: " + this.y +
      ", frameWidth: " + this.frameWidth + 
      ", frameHeight: " + this.frameHeight +
      ", sourceWidth: " + this.sourceWidth + 
      ", sourceHeight: " + this.sourceHeight;
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
  stopUpdate = function() {
    this.frameIndex = 0;
    this.ticksPerFrame = 0;
    this.numberOfFrames = 1;
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