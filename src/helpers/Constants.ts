export class Constants {
  static readonly REFRESH: number = 4; //lowering refresh rate increases game speed
  static readonly GRAVITY: number = 4; //TODO: changing this to 3 breaks the mario stand action
  static readonly ENEM_HORZ: number = 2;
  static readonly CHAR_X_POS: number = 200;
  static readonly CHAR_Y_POS: number = 0;
  static readonly CHAR_HORZ: number = 3;
  static readonly CHAR_JUMP: number = -3;
  static readonly CHAR_TPF: number = 18;
  static readonly CANVAS_HEIGHT: number = 800;
  static readonly CANVAS_WIDTH: number = 1200;
  static readonly PLATFORM_1_Y: number = 484;
  static readonly PLATFORM_2_Y: number = Constants.PLATFORM_1_Y - 228;
  static readonly BLOCK_TPF: number = 30;
  static readonly BLOCK_WIDTH: number = 64;
  static readonly BLOCK_HEIGHT: number = 64;
  static readonly TERRA_HEIGHT: number = 96;
  static readonly CHECKPOINT_BG_X: number = 1000;
  static readonly CHECKPOINT_ENEMY_DROP_X: number = 600;
  static readonly CHECKPOINT_ENEMY_DROP_Y: number = 0;
} 