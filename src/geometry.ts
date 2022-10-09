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

export function rectangularCollision(
  rect1: IRectangle,
  rect2: IRectangle
): boolean {
  return (
    rect1.x + rect1.width >= rect2.x &&
    rect1.x <= rect2.x + rect2.width &&
    rect1.y + rect1.width >= rect2.y &&
    rect1.y <= rect2.y + rect2.height
  );
}
