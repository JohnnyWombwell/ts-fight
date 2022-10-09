import { Sprite } from './sprite.js';

const gravity = 0.8;

export class FighterSprite extends Sprite {
  constructor({
    context,
    colour,
    position,
    velocity,
    attackBox = { offset: {}, width: undefined, height: undefined },
    sprites,
    scale = 1,
    offset = { x: 0, y: 0 },
    renderBoxes = false,
  }) {
    super({
      context,
      position,
      imageSrc: sprites.idle.imageSrc,
      scale,
      frameCount: sprites.idle.frameCount,
      offset,
    });

    this.colour = colour;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };

    this.sprites = sprites;

    for (const sprite in this.sprites) {
      const image = new Image();
      image.src = this.sprites[sprite].imageSrc;
      this.sprites[sprite].image = image;
    }

    this.isAttacking = false;
    this.isAnimatingAttack = false;
    this.health = 100;
    this.renderBoxes = renderBoxes;
  }

  draw() {
    super.draw();
    if (this.renderBoxes) {
      this.context.fillStyle = this.colour;
      this.context.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );

      if (this.isAnimatingAttack) {
        this.context.fillStyle = 'white';
        this.context.fillRect(
          this.attackBox.position.x,
          this.attackBox.position.y,
          this.attackBox.width,
          this.attackBox.height
        );
      }
    }
  }

  update(fighterInput) {
    if (
      this.image === this.sprites.death.image &&
      this.currentFrame === this.frameCount - 1
    ) {
      // ...dead - just draw dead frome and return
      super.draw();
      return;
    }

    if (!this.isAnimatingAttack && !this.takingHit()) {
      this.velocity.x = 0;

      let playerState = 'idle';
      if (fighterInput.left) {
        this.velocity.x = -5;
        playerState = 'run';
      } else if (fighterInput.right) {
        this.velocity.x = 5;
        playerState = 'run';
      }

      if (fighterInput.jump) {
        fighterInput.jump = false;
        if (this.isGrounded()) {
          this.velocity.y = -20;
        }
      }

      if (this.velocity.y < 0) {
        playerState = 'jump';
      } else if (this.velocity.y > 0) {
        playerState = 'fall';
      }

      this.switchSprite(playerState);
    }

    if (this.isAnimatingAttack && this.currentFrame >= this.frameCount - 1) {
      this.isAnimatingAttack = false;
      this.isAttacking = false;
    }

    super.update();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height >= this.context.canvas.height - 96) {
      this.position.y = this.context.canvas.height - this.height - 96;
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  isGrounded() {
    return this.position.y === this.context.canvas.height - this.height - 96;
  }

  attack() {
    if (this.health <= 0) {
      return;
    }

    this.isAttacking = true;
    this.isAnimatingAttack = true;
    if (this.isGrounded()) {
      this.velocity.x = 0;
    }
    this.switchSprite('attack1');
  }

  takeHit() {
    this.health -= 20;

    if (this.health > 0) {
      this.switchSprite('takeHit');
    } else {
      this.switchSprite('death');
    }
  }

  takingHit() {
    return (
      (this.image === this.sprites.takeHit.image ||
        this.image === this.sprites.death.image) &&
      this.currentFrame < this.frameCount - 1
    );
  }

  switchSprite(spriteName) {
    const sprite = this.sprites[spriteName];
    if (this.image !== sprite.image) {
      this.image = sprite.image;
      this.frameCount = sprite.frameCount;
      this.currentFrame = 0;
    }
  }
}
