const xxh = require('xxhashjs');
const Character = require('./classes/Character.js');
const physics = require('./physics.js');

const characters = {};

let io;

const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7,
};

const handleAttack = (userHash) => {

};

const setupSockets = (ioServer) => {

};

module.exports.setupSockets = setupSockets;
module.exports.handleAttack = handleAttack;
