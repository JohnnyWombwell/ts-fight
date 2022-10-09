import {
  IAnimationResource,
  ICharacterDefinition,
  IPosition,
} from './fighterResource';

export class CharacterSprite {
  private _definition: ICharacterDefinition;
  private _position: IPosition;

  constructor(definition: ICharacterDefinition, initialPostion: IPosition) {
    this._definition = definition;
    this._position = initialPostion;

    for (const animation of this._definition.animations) {
    }
  }
}

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

  public get postion(): IPosition {
    return this._position;
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

    this.draw();
  }
}
