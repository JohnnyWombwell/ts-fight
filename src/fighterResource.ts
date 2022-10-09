export interface ICharacterDefinition {
  colour: number;
  attackBox: IRectangle;
  animations: IAnimationResource[];
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ICollisionBox {
  rectangle: IRectangle;
  absolutePosition: IPosition;
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
  repeat: boolean;
}
