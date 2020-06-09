import { Sprite } from "../models/Sprite";

export interface BoundingBox {
    id: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];
    isTerminated: boolean;

    // @Output() notifyParent: EventEmitter<any> = new EventEmitter();
    getBounds(): Sprite;
    update(options : any): void;
    render(): void;
    resetCollided(): void;
    toString(): string;
    // isTerminated(): boolean;
  }