import { CharacterSprite } from './characterSprite.js';
import { Animation } from './animation.js';
import { rectangularCollision } from './geometry.js';
import {
  playerOneConfiguration,
  playerTwoConfiguration,
  sceneSpriteConfiguration,
} from './resources.js';

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

const sceneSprites = sceneSpriteConfiguration.map((c) => {
  const a = new Animation(c.resource, context);
  if (c.position) {
    a.position = c.position;
  }
  return a;
});

const playerOne = new CharacterSprite(
  playerOneConfiguration,
  { x: 200, y: 200 },
  context
);

const playerTwo = new CharacterSprite(
  playerTwoConfiguration,
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
  if (!statusElem) {
    return;
  }

  statusElem.innerHTML = gameStatusText();
  statusElem.style.display = 'flex';
}

function runTimer() {
  if (timerValue > 0) {
    timerValue -= 1;

    const timerElem = document.querySelector('#timer');
    if (!timerElem) {
      return;
    }

    timerElem.innerHTML = timerValue.toString();
    timeoutId = setTimeout(runTimer, 1000);
  }

  if (!timerValue) {
    endGame();
  }
}

function processAttack(
  attacker: CharacterSprite,
  defender: CharacterSprite,
  defenderHealthBar: string
) {
  if (
    attacker.isAttackFrame() &&
    rectangularCollision(attacker.attackBox, defender.hurtBox)
  ) {
    defender.takeHit();
    attacker.isAttacking = false;
    gsap.to(defenderHealthBar, { width: `${defender.health}%` });

    hitSound.currentTime = 0;
    hitSound.play();
    if (defender.health <= 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }
}

function processPushCollision(left: CharacterSprite, right: CharacterSprite) {
  if (left.velocity.x >= 0 && right.velocity.x >= 0) {
    right.position = {
      ...right.position,
      x: left.hurtBox.x + left.hurtBox.width,
    };
  } else if (left.velocity.x <= 0 && right.velocity.x <= 0) {
    left.position = {
      ...left.position,
      x: right.hurtBox.x - left.hurtBox.width,
    };
  } else {
    // else pushing against each other - split the overlap equally
    const overlap = left.hurtBox.x + left.hurtBox.width - right.hurtBox.x;
    left.position = {
      ...left.position,
      x: left.position.x - overlap / 2,
    };

    right.position = {
      ...right.position,
      x: right.position.x + overlap / 2,
    };
  }
}

function processPushCollisions() {
  if (!rectangularCollision(playerOne.hurtBox, playerTwo.hurtBox)) {
    return;
  }

  if (playerOne.position.x <= playerTwo.position.x) {
    processPushCollision(playerOne, playerTwo);
  } else {
    processPushCollision(playerTwo, playerOne);
  }
}

function processWallBound(left: CharacterSprite, right: CharacterSprite) {
  if (right.hurtBox.x + right.hurtBox.width > canvas.width) {
    right.position = {
      ...right.position,
      x: canvas.width - right.hurtBox.width,
    };

    left.position = {
      ...left.position,
      x: canvas.width - right.hurtBox.width - left.hurtBox.width,
    };
  } else if (left.hurtBox.x < 0) {
    left.position = {
      ...left.position,
      x: 0,
    };

    right.position = {
      ...right.position,
      x: left.hurtBox.width,
    };
  }
}

function processWallBounds() {
  if (!rectangularCollision(playerOne.hurtBox, playerTwo.hurtBox)) {
    return;
  }

  if (playerOne.position.x <= playerTwo.position.x) {
    processWallBound(playerOne, playerTwo);
  } else {
    processWallBound(playerTwo, playerOne);
  }
}

function renderLoop() {
  window.requestAnimationFrame(renderLoop);

  processAttack(playerOne, playerTwo, '#p2-health');
  processAttack(playerTwo, playerOne, '#p1-health');

  if (!playerOne.health || !playerTwo.health) {
    endGame();
  }

  for (const sprite of sceneSprites) {
    sprite.update();
  }
  playerOne.update(playerInput[0]);
  playerTwo.update(playerInput[1]);

  processPushCollisions();
  processWallBounds();

  for (const sprite of sceneSprites) {
    sprite.draw();
  }
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
