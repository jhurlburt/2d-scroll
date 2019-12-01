import { Sprite } from "../models/Sprite";
import { EventEmitter } from '@angular/core';

export interface BoundingBox {
    id: string;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];
  
    resetCollided(): void;
    update(options : any): void;
    render(): void;
    toString(): string;
    getBounds(): Sprite;
  }