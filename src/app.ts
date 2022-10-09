import { FighterSprite } from './fighterSprite.js';
import { Sprite } from './sprite.js';

const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d')!;

const playerInput = [
  {
    left: false,
    right: false,
    jump: false,
  },
  {
    left: false,
    right: false,
    jump: false,
  },
];

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const swishSounnd = new Audio('audio/schwing.mpga');
const hitSound = new Audio('audio/hit.wav');
const deathSound = new Audio('audio/death.mp3');

const background = new Sprite({
  context,
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});

const shop = new Sprite({
  context,
  position: {
    x: 608,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  frameCount: 6,
});

const player = new FighterSprite({
  context: context,
  colour: 'red',
  position: {
    x: 60,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  attackBox: {
    offset: {
      x: 50,
      y: 30,
    },
    width: 180,
    height: 70,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      frameCount: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      frameCount: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      frameCount: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      frameCount: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      frameCount: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      frameCount: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      frameCount: 6,
    },
  },
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
});

const enemy = new FighterSprite({
  context,
  colour: 'blue',
  position: {
    x: 400,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  attackBox: {
    offset: {
      x: -150,
      y: 30,
    },
    width: 150,
    height: 70,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      frameCount: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      frameCount: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      frameCount: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      frameCount: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      frameCount: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      frameCount: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      frameCount: 7,
    },
  },
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
});

function gameStatusText() {
  if (player.health > enemy.health) {
    return 'Player 1 Wins';
  }

  if (enemy.health > player.health) {
    return 'Player 2 Wins';
  }

  return 'Draw';
}

let timerValue = 100;
let timeoutId;

function endGame() {
  clearTimeout(timeoutId);

  const statusElem = document.querySelector('#game-status');
  statusElem.innerHTML = gameStatusText();
  statusElem.style.display = 'flex';
}

function runTimer() {
  if (timerValue > 0) {
    timerValue -= 1;
    document.querySelector('#timer').innerHTML = timerValue;
    timeoutId = setTimeout(runTimer, 1000);
  }

  if (!timerValue) {
    endGame();
  }
}

function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.width >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  );
}

function renderLoop() {
  window.requestAnimationFrame(renderLoop);

  // Collision detection
  if (
    player.isAttacking &&
    player.currentFrame === 4 &&
    rectangularCollision({ rect1: player.attackBox, rect2: enemy })
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('#p2-health', { width: `${enemy.health}%` });

    hitSound.currentTime = 0;
    hitSound.play();
    if (enemy.health <= 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  if (
    enemy.isAttacking &&
    enemy.currentFrame === 2 &&
    rectangularCollision({ rect1: enemy.attackBox, rect2: player })
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#p1-health', { width: `${player.health}%` });

    hitSound.currentTime = 0;
    hitSound.play();
    if (player.health <= 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  if (!player.health || !enemy.health) {
    endGame();
  }

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update(playerInput[0]);
  enemy.update(playerInput[1]);
}

runTimer();
renderLoop();

window.addEventListener('keydown', (event) => {
  console.log(`down: ${event.key}`);

  switch (event.key) {
    case 'a':
      playerInput[0].left = true;
      break;
    case 'd':
      playerInput[0].right = true;
      break;
    case 'w':
      playerInput[0].jump = true;
      break;
    case ' ':
      player.attack();
      swishSounnd.currentTime = 0;
      swishSounnd.play();
      break;
  }

  switch (event.key) {
    case 'ArrowLeft':
      playerInput[1].left = true;
      break;
    case 'ArrowRight':
      playerInput[1].right = true;
      break;
    case 'ArrowUp':
      playerInput[1].jump = true;
      break;
    case 'Enter':
      enemy.attack();
      swishSounnd.currentTime = 0;
      swishSounnd.play();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      playerInput[0].left = false;
      break;
    case 'd':
      playerInput[0].right = false;
      break;
  }

  switch (event.key) {
    case 'ArrowLeft':
      playerInput[1].left = false;
      break;
    case 'ArrowRight':
      playerInput[1].right = false;
      break;
  }
});
