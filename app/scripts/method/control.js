const squareWidth    = 1.5;
const squareHeight   = squareWidth * 1;
const jumpPower      = 0.4;
const sideSpeed      = 0.1;
const gravity        = 0.02;
const bounceFriction = 0.5;
const airResistance  = 0.99;
const settleSpeed    = 0.1;
const rotationFunction = y => Math.max(-0.1, Math.min(0.3, y * 0.8));

const pos   = {};
const speed = {
  x: 0,
  y: 0,
};
const size  = {
  width:  squareWidth,
  height: squareHeight,
};
const controls = {
  ArrowUp: {
    down: jump,
    up()  {  },
  },

  ArrowRight: {
    down() { speed.x = sideSpeed; },
    up()   { speed.x = 0; },
  },

  ArrowLeft: {
    down() { speed.x = -sideSpeed; },
    up()   { speed.x =  0; },
  },
}
let firstRun = true;
let lastPressed;
let lastDepressed;


export default {
  sim,
  init,
  pos,
  size,
}

window.addEventListener('keydown', e => {
  if (controls[e.code]) {
    e.preventDefault();
    keyDown(e.code);
  }
});

window.addEventListener('keyup', e => {
  if (controls[e.code]) {
    e.preventDefault();
    keyUp(e.code);
  }
});

window.addEventListener('mousedown',  jump);
window.addEventListener('touchstart', jump);

function sim(stage) {
  if (firstRun) {
    init(stage);
    firstRun = false;
  } else {
    simUnit(stage);
  }
}

function init(stage) {
  pos.x = squareWidth * 1.5;
  pos.y = (stage.height / 2);
}

function keyUp(code) {
  controls[code].up && controls[code].up();
}

function keyDown(code) {
  controls[code].down && controls[code].down();
}

function jump(e) {
  e && e.preventDefault();
  speed.y = -jumpPower;
}

function simUnit(stage) {
  if (speed.x) {
    pos.x += speed.x;

    if (pos.x < squareWidth / 2) {
      pos.x = squareWidth / 2;
    } else if (pos.x > stage.width - (squareWidth / 2)) {
      pos.x = stage.width - (squareWidth / 2);
    }
  }

  pos.y   += speed.y;
  speed.y = (speed.y + gravity) * airResistance;

  if (pos.y < squareHeight / 2) {
    speed.y *= -bounceFriction;
    pos.y   = squareHeight / 2;
  } else if (pos.y >= stage.height - (squareHeight / 2)) {
    speed.y = Math.abs(speed.y) > settleSpeed ? speed.y * -bounceFriction : 0;
    pos.y   = stage.height - (squareHeight / 2);
  }

  pos.rot = rotationFunction(speed.y);
}
