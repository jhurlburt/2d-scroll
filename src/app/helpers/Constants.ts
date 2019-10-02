export class Constants {
    static readonly REFRESH: number = 3;
    static readonly CHAR_X: number = 200;
    static readonly CHAR_Y: number = 650;
    static readonly CHAR_MOVE: number = 2;
    static readonly CHAR_JUMP: number = -3;
    static readonly CHAR_FALL: number = 4; //TODO: changing this to 3 breaks the mario stand action
    static readonly CHAR_TPF: number = 18;
    static readonly CHAR_HEIGHT: number = 64;
    static readonly CHAR_WIDTH: number = 64;
    static readonly CHAR_MAX_JUMP: number = Constants.CHAR_HEIGHT * 5;
    static readonly CANVAS_HEIGHT: number = 800;
    static readonly CANVAS_WIDTH: number = 1200;
    static readonly PLATFORM_1_Y: number = 484;
    static readonly PLATFORM_2_Y: number = Constants.PLATFORM_1_Y - 228;
    static readonly BLOCK_TPF: number = 30;
    static readonly BLOCK_WIDTH: number = 58;
    static readonly BLOCK_HEIGHT: number = 58;
  }  