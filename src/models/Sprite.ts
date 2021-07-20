import { Constants } from "src/helpers/Constants";

const ANIMATE_TPF: number = 30;
const ANIMATE_Y_OFFSET: number = 20;
const SIZE_MULTIPLIER: number = 4;
const TPF: number = 18;

export class Sprite  {
  public x: number = 0;
  public y: number = 0;
  public frameWidth: number = 0;
  public frameHeight: number = 0;
  private context: CanvasRenderingContext2D;
  private dataMaps: number[][][];
  private frameIndex: number = 0;
  private ticksPerFrame: number = 0;
  private tickCount: number = 0;
  private direction: string = "";
  private colorPallette: string[];
  private canvases: HTMLCanvasElement[];
  // private canvas: HTMLCanvasElement;
  private _stopUpdate: boolean = false;
  private _animateCount: number = 0;

  constructor(options) {
    this.ticksPerFrame = options.ticksPerFrame || TPF;
    this.context = options.context || null;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.dataMaps = options.dataMaps || null;
    this.direction = options.direction || "right";
    this.colorPallette = options.colorPallette || ['#FFF','#cc1616','#6e3d23','#ffc17a','#dbde31','#333','#182a99'];
    this.frameWidth = options.frameWidth || 0;
    this.frameHeight = options.frameHeight || 0;
    this.canvases = [];
    // this.canvas = null;

    if (this.frameWidth == 0){
      this.frameWidth = (this.dataMap != null)
        ? (this.dataMap[0].length * SIZE_MULTIPLIER) 
        : 0;
    }
    if (this.frameHeight == 0){
      this.frameHeight = (this.dataMap != null)
        ? (this.dataMap.length * SIZE_MULTIPLIER)
        : 0;
    }
  }

  get dataMap(): number[][] {
    return (this.dataMaps.length > this.frameIndex) 
    ? this.dataMaps[this.frameIndex]
    : null;
  }

  get numberOfFrames(): number {
    return this.dataMaps.length;
  }

  update(vert: number, scroll: number) {

    if (this._animateCount > 0){
      this._animateCount--;
      if (this._animateCount == 0){
        this.y += ANIMATE_Y_OFFSET;
      }  
    }
    if (!this._stopUpdate){
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
    }
    this.x += scroll;
    this.y += vert;
  };

  render(srcX: number = 0, srcY: number = 0, srcWidth: number = 1200, srcHeight: number = 800) {
    // var ctx = this.context;
    if (this.canvases[this.frameIndex] == null){
      this.canvases[this.frameIndex] = document.createElement('canvas');
      this.canvases[this.frameIndex].width = this.dataMap[0].length * SIZE_MULTIPLIER;
      this.canvases[this.frameIndex].height = this.dataMap.length * SIZE_MULTIPLIER;

      var ctx = this.canvases[this.frameIndex].getContext('2d'); 
    
      if (this.dataMap != null){
        //traversing the image y-axis
        for (var i=0; i<this.dataMap.length; i++){
          // var y =  this.y + (SIZE_MULTIPLIER * i);
          var y =  (SIZE_MULTIPLIER * i);
    
          //traversing the image x-axis
          for (var j=0; j<this.dataMap[0].length; j++){
            // var x = this.x + (SIZE_MULTIPLIER * j);
            var x = (SIZE_MULTIPLIER * j);
            
            var color = (this.direction == "right") ? 
              this.dataMap[i][j] :
              this.dataMap[i][this.dataMap[0].length-1-j]; //SMACK UP, FLIP IT, REVERSE IT
  
            if (color != 0){
              if(((x + SIZE_MULTIPLIER >= srcX) && (x < srcX + srcWidth)) &&
                  ((y + SIZE_MULTIPLIER >= srcY) && (y < srcY + srcHeight))) {
                    ctx.fillStyle = this.colorPallette[color];
                    ctx.fillRect(x, y, SIZE_MULTIPLIER, SIZE_MULTIPLIER);                    

              }
            }
          }
        }
      }
    }
    this.context.drawImage(this.canvases[this.frameIndex], this.x, this.y);
  };

  animate() {
    this.y -= ANIMATE_Y_OFFSET; //MOVE VERT POS BY OFFSET SIZE
    this._animateCount = ANIMATE_TPF; //REMAIN IN NEW VERT POS FOR DURATION OF COUNT
    this.stopUpdate(); //STOP FRAME INDEX UPDATES - MAINTAIN INITIAL STATE
  }

  stopUpdate() {
    this._stopUpdate = true;
    this.frameIndex = 0;
  };

  toString () {
    return "x: " + this.x + 
      ", y: " + this.y;
  };
}