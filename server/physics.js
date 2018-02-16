const sockets = require('./sockets.js');

let charList = {};
const attacks = [];

const checkCollisions = (rect1, rect2, width, height) => {
  if (rect1.x < rect2.x + width &&
     rect1.x + width > rect2.x &&
     rect1.y < rect2.y + height &&
     height + rect1.y > rect2.y) {
    return true;
  }
  return false;
};

const checkAttackCollision = (character, attackObj) => {
  const attack = attackObj;

};

const checkAttacks = () => {

};

const setCharacterList = (characterList) => {

};

const setCharacter = (character) => {

};

const addAttack = (attack) => {

};

setInterval(() => {
  checkAttacks();
}, 20);

module.exports.setCharacterList = setCharacterList;
module.exports.setCharacter = setCharacter;
module.exports.addAttack = addAttack;
