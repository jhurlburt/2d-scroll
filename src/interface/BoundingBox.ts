import { Sprite } from "../models/Sprite";
import { EventEmitter } from '@angular/core';

export interface BoundingBox {
    id: string;
    name: string;
    bounds: Sprite;
    hasCollidedTop: string[];
    hasCollidedBottom: string[];
    hasCollidedLeft: string[];
    hasCollidedRight: string[];
    collisionObjectId: string[];
  
    hasCollided(): boolean;
    resetCollided(): void;
    update(options : any): void;
    render(): void;
    toString(): string;
  }