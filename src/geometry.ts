export interface IPosition {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
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
