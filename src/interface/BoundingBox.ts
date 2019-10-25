import { Sprite } from "../models/Sprite";
import { EventEmitter } from '@angular/core';

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
    update(options : any): void;
    render(): void;
    toString(): string;
  }