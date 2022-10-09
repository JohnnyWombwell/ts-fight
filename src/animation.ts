import { IPosition } from './geometry.js';
import { IAnimationResource } from './resourceDefinitions.js';

export class Animation {
  private readonly _definition: IAnimationResource;
  private _currentFrame = 0;
  private _framesElapsed = 0;
  private _position: IPosition = { x: 0, y: 0 };
  private _context: CanvasRenderingContext2D;
  private _image: HTMLImageElement;

  constructor(
    definition: IAnimationResource,
    context: CanvasRenderingContext2D
  ) {
    this._definition = definition;

    this._image = new Image();
    this._image.src = definition.imageSource;

    this._context = context;
  }

  public reset(): void {
    this._currentFrame = 0;
  }

  public get position(): IPosition {
    return this._position;
  }

  public set position(position: IPosition) {
    this._position = position;
  }

  public get currentFrame(): number {
    return this._currentFrame;
  }

  public draw(): void {
    this._context.drawImage(
      this._image,
      this._currentFrame * (this._image.width / this._definition.frameCount),
      0,
      this._image.width / this._definition.frameCount,
      this._image.height,
      this._position.x - this._definition.offset.x,
      this._position.y - this._definition.offset.y,
      (this._image.width / this._definition.frameCount) *
        this._definition.scale,
      this._image.height * this._definition.scale
    );
  }

  public update(): void {
    this._framesElapsed++;

    if (this._framesElapsed % this._definition.framesHold === 0) {
      this._currentFrame =
        (this._currentFrame + 1) % this._definition.frameCount;
    }
  }

  public isAnimating(): boolean {
    // TODO: implement this for non looping animations
    return this._currentFrame < this._definition.frameCount - 1;
  }
}
