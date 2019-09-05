

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var img: HTMLImageElement = new Image();

function gameLoop(): void {
    requestAnimationFrame(gameLoop);
    keyInput.inputLoop();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1280, 720);

    sprite.draw();
}

class cKeyboardInput {
    public keyCallback: { [keycode: number]: () => void; } = {};
    public keyDown: { [keycode: number]: boolean; } = {};
    constructor() {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        if (this.keyCallback[event.keyCode] != null) {
            event.preventDefault();
        }
        this.keyDown[event.keyCode] = true;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    public inputLoop = (): void => {
        for (var key in this.keyDown) {
            var is_down: boolean = this.keyDown[key];

            if (is_down) {
                var callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    callback();
                }
            }
        }
    }
}

class cFrame {
    x: number;
    y: number;
    w: number;
    h: number;

    ox: number;
    oy: number
    constructor(x: number = 0, y: number = 0, w: number = 1, h: number = 1, ox: number = 0, oy: number = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ox = ox;
        this.oy = oy;
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}


class cTextureAtlas {
    public frames: { [index: string]: cFrame } = {};
    public taLoadComplete: boolean = false;
    public image: HTMLImageElement = new Image();
    public atlasName: string = "";
    private _imageFile: string = "";
    private _jsonFile: string = "";
    private _loadCallback: () => void;

    constructor(atlasName: string, loadCallback: () => void) {
        this.atlasName = atlasName;
        this._imageFile = atlasName;
        this._jsonFile = atlasName.replace(".png", "") + ".json";

        this._loadCallback = loadCallback;
        this._loadJSON();

    }

    protected _loadJSON = () => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                this.image.onload = this.onImageLoad;
                this.image.onerror = this.onImageError;
                this.image.src = this._imageFile;

                this._onRead(JSON.parse(xhr.responseText));
            }
            else {
                this._onError(xhr);
            }
        };
        xhr.open("GET", this._jsonFile, true);
        xhr.send();
    }

    protected _onRead = (data: any) => {
        var temp_frame: cFrame;

        for (var frame_name in data.frames) {
            var sprite_data: any = data.frames[frame_name];

            temp_frame = new cFrame(sprite_data.frame.x,
                sprite_data.frame.y,
                sprite_data.frame.w,
                sprite_data.frame.h,
                sprite_data.spriteSourceSize.x,
                sprite_data.spriteSourceSize.y
            );

            this.frames[frame_name] = temp_frame;
        }

    }
    protected _onError = (xhr: XMLHttpRequest) => {
        console.log("FAILED TO LOAD ATLAS: " + this._jsonFile);
    }

    private onImageLoad = () => {
        this.taLoadComplete = true;
        this._loadCallback();
    }

    private onImageError = () => {
        console.log("IMAGE LOAD ERROR");
    }

    public containsFrame = (frameName: string): boolean => {
        if (this.frames[frameName] !== undefined &&
            this.frames[frameName] !== null) {
            return true;
        }
        return false;
    }
}


class cAnimatedSprite {
    public x: number = 0;
    public y: number = 0;
    public frameCount: number = 0;
    public atlas: cTextureAtlas;
    public sequenceName: string = "";

    public currentFrame = 0;

    constructor(x: number, y: number, frame_count: number, atlas: cTextureAtlas, sequence_name: string) {
        this.x = x;
        this.y = y;
        this.frameCount = frame_count;
        this.atlas = atlas;
        this.sequenceName = sequence_name;
    }

    public draw = (): void => {
        this.currentFrame++;
        if (this.currentFrame >= this.frameCount) {
            this.currentFrame = 0;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.atlas.image,
            this.atlas.frames[this.getFrameString()].x, this.atlas.frames[this.getFrameString()].y,
            this.atlas.frames[this.getFrameString()].w, this.atlas.frames[this.getFrameString()].h,
            this.atlas.frames[this.getFrameString()].ox, this.atlas.frames[this.getFrameString()].oy,
            this.atlas.frames[this.getFrameString()].w, this.atlas.frames[this.getFrameString()].h);
        ctx.restore();
    }

    public getFrameString = (): string => {
        if (this.currentFrame > 9) {
            return this.sequenceName + this.currentFrame.toString() + ".png";
        }
        return this.sequenceName + "0" + this.currentFrame.toString() + ".png";
    }
}

function shipUp(): void {
    sprite.y -= 2;
}

function shipDown(): void {
    sprite.y += 2;
}

function shipLeft(): void {
    sprite.x -= 2;
}

function shipRight(): void {
    sprite.x += 2;
}

var keyInput: cKeyboardInput;
var atlas: cTextureAtlas;
var sprite: cAnimatedSprite;

window.onload = () => {
    img = <HTMLImageElement>document.getElementById('spaceship');
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    ctx = canvas.getContext("2d");

    keyInput = new cKeyboardInput();
    atlas = new cTextureAtlas("images/atlas.png", gameLoop);
    sprite = new cAnimatedSprite(100, 100, 35, atlas, "Asteroid");
    
    // PRESS LEFT ARROW OR 'A' KEY
    keyInput.addKeycodeCallback(37, shipLeft);
    keyInput.addKeycodeCallback(65, shipLeft);

    // PRESS UP ARROW OR 'W' KEY
    keyInput.addKeycodeCallback(38, shipUp);
    keyInput.addKeycodeCallback(87, shipUp);

    // PRESS RIGHT ARROW OR 'D' KEY
    keyInput.addKeycodeCallback(39, shipRight);
    keyInput.addKeycodeCallback(68, shipRight);

    // PRESS DOWN ARROW OR 'S' KEY
    keyInput.addKeycodeCallback(40, shipDown);
    keyInput.addKeycodeCallback(83, shipDown);

    //    gameLoop();
};