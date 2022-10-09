import { IPosition } from './geometry';
import {
  IAnimationResource,
  ICharacterDefinition,
} from './resourceDefinitions';

export const playerOneConfiguration: ICharacterDefinition = {
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
};

export const playerTwoConfiguration: ICharacterDefinition = {
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
};

export const sceneSpriteConfiguration: {
  resource: IAnimationResource;
  position?: IPosition;
}[] = [
  {
    resource: {
      offset: { x: 0, y: 0 },
      imageSource: './img/background.png',
      scale: 1,
      frameCount: 1,
      framesHold: 1,
      repeat: true,
    },
  },
  {
    resource: {
      offset: { x: 0, y: 0 },
      imageSource: './img/shop.png',
      scale: 2.75,
      frameCount: 6,
      framesHold: 5,
      repeat: true,
    },
    position: {
      x: 608,
      y: 128,
    },
  },
];
