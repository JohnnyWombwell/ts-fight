export class Sprite {
  constructor({
    context,
    position,
    imageSrc,
    scale = 1,
    frameCount = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.context = context;
    this.position = position;
    this.offset = offset;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameCount = frameCount;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
  }

  draw() {
    this.context.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.frameCount),
      0,
      this.image.width / this.frameCount,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameCount) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }

    this.draw();
  }
}
