import { ICharacterDefinition } from './resourceDefinitions.js';
import { Animation } from './animation.js';
import { IPosition } from './geometry.js';

const gravity = 0.8;

export interface ICharacterInput {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface IVelocity {
  x: number;
  y: number;
}

export class CharacterSprite {
  private readonly _definition: ICharacterDefinition;
  private readonly _animations: Record<string, Animation> = {};
  private readonly _renderBoxes: boolean;
  private _currentAnimation: Animation;
  private _velocity: IVelocity = { x: 0, y: 0 };
  private _isAttacking = false;
  private _isAnimatingAttack = false;
  private _health = 100;
  private _context: CanvasRenderingContext2D;
  private _attackBox: {
    position: IPosition;
    offset: IPosition;
    width: number;
    height: number;
  };

  constructor(
    definition: ICharacterDefinition,
    initialPostion: IPosition,
    context: CanvasRenderingContext2D,
    renderBoxes: boolean = false
  ) {
    this._definition = definition;
    this._context = context;
    this._renderBoxes = renderBoxes;

    this._attackBox = {
      position: { x: definition.attackBox.x, y: definition.attackBox.y },
      offset: { x: definition.attackBox.x, y: definition.attackBox.y },
      width: definition.attackBox.width,
      height: definition.attackBox.height,
    };

    for (const animationName in definition.animations) {
      this._animations[animationName] = new Animation(
        definition.animations[animationName],
        context
      );
    }

    this._currentAnimation = this._animations.idle;
    this._currentAnimation.position = initialPostion;
  }

  public get health(): number {
    return this._health;
  }

  public get hurtBox(): unknown {
    return {
      position: {
        x: this._currentAnimation.position.x,
        y: this._currentAnimation.position.y,
      },
      width: this._definition.size.width,
      height: this._definition.size.height,
    };
  }

  public get attackBox(): unknown {
    return this._attackBox;
  }

  public get isAttacking() {
    return this._isAttacking;
  }

  public set isAttacking(attacking: boolean) {
    this._isAttacking = attacking;
  }

  public isAttackFrame(): boolean {
    if (
      this._isAttacking &&
      this._currentAnimation.currentFrame ===
        this._definition.animations.attack1?.attackFrame
    ) {
      return true;
    }

    return false;
  }

  public attack(): void {
    if (this._health <= 0) {
      return;
    }

    this._isAttacking = true;
    this._isAnimatingAttack = true;

    if (this.isGrounded()) {
      this._velocity.x = 0;
    }

    this.switchSprite('attack1');
  }

  public takeHit(): void {
    this._health -= 20;

    if (this._health > 0) {
      this.switchSprite('takeHit');
    } else {
      this.switchSprite('death');
    }
  }

  public draw(): void {
    this._currentAnimation.draw();

    if (!this._renderBoxes) {
      return;
    }

    this._context.globalAlpha = 0.4;

    this._context.fillStyle = 'green';
    this._context.fillRect(
      this._currentAnimation.position.x,
      this._currentAnimation.position.y,
      this._definition.size.width,
      this._definition.size.height
    );

    if (this.isAttackFrame()) {
      this._context.fillStyle = 'red';
      this._context.fillRect(
        this._attackBox.position.x,
        this._attackBox.position.y,
        this._attackBox.width,
        this._attackBox.height
      );
    }

    this._context.globalAlpha = 1.0;
  }

  public update(inputState: ICharacterInput): void {
    // TODO: work out proper game state for this...
    if (
      this._currentAnimation === this._animations.death &&
      !this._currentAnimation.isAnimating()
    ) {
      // ...dead - just draw dead frome and return
      this._currentAnimation.draw();
      return;
    }

    if (!this._isAnimatingAttack && !this.takingHit()) {
      this._velocity.x = 0;

      let playerState = 'idle';
      if (inputState.left) {
        this._velocity.x = -5;
        playerState = 'run';
      } else if (inputState.right) {
        this._velocity.x = 5;
        playerState = 'run';
      }

      if (inputState.jump) {
        inputState.jump = false;
        if (this.isGrounded()) {
          this._velocity.y = -20;
        }
      }

      if (this._velocity.y < 0) {
        playerState = 'jump';
      } else if (this._velocity.y > 0) {
        playerState = 'fall';
      }

      this.switchSprite(playerState);
    }

    if (this._isAnimatingAttack && !this._currentAnimation.isAnimating()) {
      this._isAnimatingAttack = false;
      this._isAttacking = false;
    }

    this._currentAnimation.update();

    this._attackBox.position.x =
      this._currentAnimation.position.x + this._attackBox.offset.x;
    this._attackBox.position.y =
      this._currentAnimation.position.y + this._attackBox.offset.y;

    this._currentAnimation.position.x += this._velocity.x;
    this._currentAnimation.position.y += this._velocity.y;

    if (
      this._currentAnimation.position.y + this._definition.size.height >=
      this._context.canvas.height - 96
    ) {
      this._currentAnimation.position.y =
        this._context.canvas.height - this._definition.size.height - 96;
      this._velocity.y = 0;
    } else {
      this._velocity.y += gravity;
    }
  }

  private switchSprite(spriteName: string): void {
    const animation = this._animations[spriteName];
    if (this._currentAnimation !== animation) {
      console.log(`Switch to ${spriteName}`);
      animation.reset();
      animation.position = this._currentAnimation.position;
      this._currentAnimation = animation;
    }
  }

  private isGrounded(): boolean {
    return (
      this._currentAnimation.position.y ===
      this._context.canvas.height - this._definition.size.height - 96
    );
  }

  private takingHit(): boolean {
    return (
      (this._currentAnimation === this._animations.takeHit ||
        this._currentAnimation === this._animations.death) &&
      this._currentAnimation.isAnimating()
    );
  }
}
