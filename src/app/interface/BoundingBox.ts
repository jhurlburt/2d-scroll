import { Sprite } from "../models/Sprite";

export interface BoundingBox {
    //public fields
    id: string;
    name: string;
    boundingBox: Sprite;
    platform_y: number;
    hasCollidedTop: boolean;
    hasCollidedBottom: boolean;
    hasCollidedLeft: boolean;
    hasCollidedRight: boolean;
    collisionObjectName: string;
    collisionObjectId: number;
  
    hasCollided(): boolean;
    resetCollided(): void;
    update(hor: number, vert: number, platform_y: number): void;
    render(): void;
    toString(): string;
  }