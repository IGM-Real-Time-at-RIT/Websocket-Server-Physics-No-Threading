// our socket code for physics to send updates back
const sockets = require('./sockets.js');

let charList = {}; // list of characters
const attacks = []; // array of attack to handle

// box collision check between two rectangles
// of a set width/height
const checkCollisions = (rect1, rect2, width, height) => {
  if (rect1.x < rect2.x + width &&
     rect1.x + width > rect2.x &&
     rect1.y < rect2.y + height &&
     height + rect1.y > rect2.y) {
    return true; // is colliding
  }
  return false; // is not colliding
};

// check attack collisions to see if colliding with the
// user themselves and return false so users cannot damage
// themselves
const checkAttackCollision = (character, attackObj) => {
  const attack = attackObj;

  // if attacking themselves, we won't check collision
  if (character.hash === attack.hash) {
    return false;
  }

  // otherwise check collision of user rect and attack rect
  return checkCollisions(character, attack, attack.width, attack.height);
};

// handle each attack and calculate collisions
const checkAttacks = () => {
  // if we have attack
  if (attacks.length > 0) {
    // get all characters
    const keys = Object.keys(charList);
    const characters = charList;

    // for each attack
    for (let i = 0; i < attacks.length; i++) {
      // for each character
      for (let k = 0; k < keys.length; k++) {
        const char1 = characters[keys[k]];

        // call to see if the attack and character hit
        const hit = checkAttackCollision(char1, attacks[i]);

        if (hit) { // if a hit
          // ask sockets to notify users which character was hit
          sockets.handleAttack(char1.hash);
          // kill that character and remove from our user list
          delete charList[char1.hash];
        } else {
          // if not a hit
          console.log('miss');
        }
      }

      // once the attack has been calculated again all users
      // remove this attack and move onto the next one
      attacks.splice(i);
      // decrease i since our splice changes the array length
      i--;
    }
  }
};

// update our entire character list
const setCharacterList = (characterList) => {
  charList = characterList;
};

// update an individual character
const setCharacter = (character) => {
  charList[character.hash] = character;
};

// add a new attack to calculate physics on
const addAttack = (attack) => {
  attacks.push(attack);
};

// check for collisions every 20ms
setInterval(() => {
  checkAttacks();
}, 20);

module.exports.setCharacterList = setCharacterList;
module.exports.setCharacter = setCharacter;
module.exports.addAttack = addAttack;
