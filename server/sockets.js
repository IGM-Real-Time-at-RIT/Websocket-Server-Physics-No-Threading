// fast hashing library
const xxh = require('xxhashjs');
// Character custom class
const Character = require('./classes/Character.js');
// our physics calculation file
const physics = require('./physics.js');

// object of user characters
const characters = {};

// our socketio instance
let io;

// Possible directions a user can move
// their character. These are mapped
// to integers for fast/small storage
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

// function to notify everyone when a user has been hit
const handleAttack = (userHash) => {
  io.sockets.in('room1').emit('attackHit', userHash);
};

// function to setup our socket server
const setupSockets = (ioServer) => {
  // set our io server instance
  io = ioServer;

  // on socket connections
  io.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1'); // join user to our socket room

    // create a unique id for the user based on the socket id and time
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    // create a new character and store it by its unique id
    characters[hash] = new Character(hash);

    // add the id to the user's socket object for quick reference
    socket.hash = hash;

    // emit a joined event to the user and send them their character
    socket.emit('joined', characters[hash]);

    // when this user sends the server a movement update
    socket.on('movementUpdate', (data) => {
      // update the user's info
      // NOTICE: THIS IS NOT VALIDED AND IS UNSAFE
      characters[socket.hash] = data;
      // update the timestamp of the last change for this character
      characters[socket.hash].lastUpdate = new Date().getTime();
      // update our physics simulation with the character's updates
      physics.setCharacter(characters[socket.hash]);

      // notify everyone of the user's updated movement
      io.sockets.in('room1').emit('updatedMovement', characters[socket.hash]);
    });

    // when this user sends an attack request
    socket.on('attack', (data) => {
      const attack = data;

      // should we handle the attack
      // I only did this because I did not code
      // for all player directions.
      let handleAttackEvent = true;

      // which direction is the user attacking in
      // will be an integer from our directions structure
      switch (attack.direction) {
        // if down, set the height/width of attack to face down
        // and offset attack downward from user
        case directions.DOWN: {
          attack.width = 66;
          attack.height = 183;
          attack.y = attack.y + 121;
          break;
        }
        // if left, set the height/width of attack to face left
        // and offset attack left from user
        case directions.LEFT: {
          attack.width = 183;
          attack.height = 66;
          attack.x = attack.x - 183;
          break;
        }
        // if right, set the height/width of attack to face right
        // and offset attack right from user
        case directions.RIGHT: {
          attack.width = 183;
          attack.height = 66;
          attack.x = attack.x + 61;
          break;
        }
        // if up, set the height/width of attack to face up
        // and offset attack upward from user
        case directions.UP: {
          attack.width = 66;
          attack.height = 183;
          attack.y = attack.y - 183;
          break;
        }
        // any other direction we will not handle
        default: {
          handleAttackEvent = false;
        }
      }

      // if handling the attack
      if (handleAttackEvent) {
        // send the graphical update to everyone
        // This will NOT perform the collision or character death
        // This just updates graphics so people see the attack
        io.sockets.in('room1').emit('attackUpdate', attack);

        // add the attack to our physics calculations
        physics.addAttack(attack);
      }
    });

    // when the user disconnects
    socket.on('disconnect', () => {
      // let everyone know this user left
      io.sockets.in('room1').emit('left', characters[socket.hash]);
      // remove this user from our object
      delete characters[socket.hash];
      // update the character list in our physics calculations
      physics.setCharacterList(characters);

      // remove this user from the socket room
      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
module.exports.handleAttack = handleAttack;
