import { Sprite } from "../models/Sprite";

export interface BoundingBox {
    id: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];

    // @Output() notifyParent: EventEmitter<any> = new EventEmitter();

    resetCollided(): void;
    update(options : any): void;
    render(): void;
    toString(): string;
    getBounds(): Sprite;
  }