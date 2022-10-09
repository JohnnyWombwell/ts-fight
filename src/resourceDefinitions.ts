import { IPosition, IRectangle, ISize } from './geometry.js';

export interface ICharacterDefinition {
  colour: string;
  size: ISize;
  attackBox: IRectangle;
  animations: Record<string, IAnimationResource>;
}

/**
 * Animation Resource
 * Defines animation resource for frames of
 * equal size arranged horizontally.
 */
export interface IAnimationResource {
  imageSource: string;
  scale: number;
  offset: IPosition;
  frameCount: number;
  framesHold: number;
  repeat?: boolean;
  attackFrame?: number;
}
