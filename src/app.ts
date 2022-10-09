import { CharacterSprite } from './characterSprite.js';
import { Animation } from './animation.js';

interface Gsap {
  to(value: string, transform: unknown): void;
}

declare var gsap: Gsap;

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

const swishSound = new Audio('audio/schwing.mpga');
const hitSound = new Audio('audio/hit.wav');
const deathSound = new Audio('audio/death.mp3');

const background = new Animation(
  {
    offset: { x: 0, y: 0 },
    imageSource: './img/background.png',
    scale: 1,
    frameCount: 1,
    framesHold: 1,
    repeat: true,
  },
  context
);

const shop = new Animation(
  {
    offset: { x: 0, y: 0 },
    imageSource: './img/shop.png',
    scale: 2.75,
    frameCount: 6,
    framesHold: 5,
    repeat: true,
  },
  context
);

shop.position = {
  x: 608,
  y: 128,
};

const playerOne = new CharacterSprite(
  {
    colour: 'red',
    size: {
      width: 50,
      height: 130,
    },
    attackBox: {
      x: 50,
      y: 30,
      width: 180,
      height: 70,
    },
    animations: {
      idle: {
        imageSource: './img/samuraiMack/Idle.png',
        frameCount: 8,
        offset: {
          x: 225,
          y: 175,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      run: {
        imageSource: './img/samuraiMack/Run.png',
        frameCount: 8,
        offset: {
          x: 225,
          y: 175,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      jump: {
        imageSource: './img/samuraiMack/Jump.png',
        frameCount: 2,
        offset: {
          x: 225,
          y: 175,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      fall: {
        imageSource: './img/samuraiMack/Fall.png',
        frameCount: 2,
        offset: {
          x: 225,
          y: 175,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      attack1: {
        imageSource: './img/samuraiMack/Attack1.png',
        frameCount: 6,
        offset: {
          x: 225,
          y: 175,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
        attackFrame: 4,
      },
      takeHit: {
        imageSource: './img/samuraiMack/Take Hit - white silhouette.png',
        frameCount: 4,
        offset: {
          x: 225,
          y: 175,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      death: {
        imageSource: './img/samuraiMack/Death.png',
        frameCount: 6,
        offset: {
          x: 225,
          y: 175,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
    },
  },
  { x: 200, y: 200 },
  context
);

const playerTwo = new CharacterSprite(
  {
    colour: 'blue',
    size: {
      width: 50,
      height: 140,
    },
    attackBox: {
      x: -150,
      y: 30,
      width: 150,
      height: 70,
    },
    animations: {
      idle: {
        imageSource: './img/kenji/Idle.png',
        frameCount: 4,
        offset: {
          x: 215,
          y: 180,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      run: {
        imageSource: './img/kenji/Run.png',
        frameCount: 8,
        offset: {
          x: 215,
          y: 180,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      jump: {
        imageSource: './img/kenji/Jump.png',
        frameCount: 2,
        offset: {
          x: 215,
          y: 180,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      fall: {
        imageSource: './img/kenji/Fall.png',
        frameCount: 2,
        offset: {
          x: 215,
          y: 180,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      attack1: {
        imageSource: './img/kenji/Attack1.png',
        frameCount: 4,
        offset: {
          x: 215,
          y: 180,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
        attackFrame: 1,
      },
      takeHit: {
        imageSource: './img/kenji/Take hit.png',
        frameCount: 3,
        offset: {
          x: 215,
          y: 180,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
      death: {
        imageSource: './img/kenji/Death.png',
        frameCount: 7,
        offset: {
          x: 215,
          y: 180,
        },
        framesHold: 5,
        scale: 2.5,
        repeat: true,
      },
    },
  },
  { x: 400, y: 200 },
  context
);

function gameStatusText() {
  if (playerOne.health > playerTwo.health) {
    return 'Player 1 Wins';
  }

  if (playerTwo.health > playerOne.health) {
    return 'Player 2 Wins';
  }

  return 'Draw';
}

let timerValue = 100;
let timeoutId: number | undefined;

function endGame() {
  clearTimeout(timeoutId);

  const statusElem = document.querySelector<HTMLElement>('#game-status');
  statusElem.innerHTML = gameStatusText();
  statusElem.style.display = 'flex';
}

function runTimer() {
  if (timerValue > 0) {
    timerValue -= 1;
    document.querySelector('#timer').innerHTML = timerValue.toString();
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
    playerOne.isAttackFrame() &&
    rectangularCollision({
      rect1: playerOne.attackBox,
      rect2: playerTwo.hurtBox,
    })
  ) {
    playerTwo.takeHit();
    playerOne.isAttacking = false;
    gsap.to('#p2-health', { width: `${playerTwo.health}%` });

    hitSound.currentTime = 0;
    hitSound.play();
    if (playerTwo.health <= 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  if (
    playerTwo.isAttackFrame() &&
    rectangularCollision({
      rect1: playerTwo.attackBox,
      rect2: playerOne.hurtBox,
    })
  ) {
    playerOne.takeHit();
    playerTwo.isAttacking = false;
    gsap.to('#p1-health', { width: `${playerOne.health}%` });

    hitSound.currentTime = 0;
    hitSound.play();
    if (playerOne.health <= 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  if (!playerOne.health || !playerTwo.health) {
    endGame();
  }

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  shop.update();

  playerOne.update(playerInput[0]);
  playerTwo.update(playerInput[1]);

  background.draw();
  shop.draw();
  playerOne.draw();
  playerTwo.draw();
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
      playerOne.attack();
      swishSound.currentTime = 0;
      swishSound.play();
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
      playerTwo.attack();
      swishSound.currentTime = 0;
      swishSound.play();
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
