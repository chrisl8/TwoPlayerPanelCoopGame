const five = require('johnny-five');
const { spawn } = require('child_process');

const stationList = require('./stationList');
const gameState = require('./gameState');
const settings = require('./settings');
// const webServer = require('./webServer');
const display = require('./display');

// webServer();

// Dump Station data
// for (let i = 0; i < stationList.length; i++) {
//     stationList[i].forEach(button => {
//         console.log(`Station ${i} button ${button.id} is ${button.label}.`);
//     })
// }

display.initialize();

// Johnny Five section
// TODO: Set up all Johnny Five devices and set them to update the stationList objects.
const board = new five.Board({
  port: '/dev/ttyACM0',
  repl: settings.johnnyFiveRepl, // IF you don't want the REPL to display, because maybe you are doing something else on the terminal, turn it off this way.
  debug: settings.johnnyFiveDebug, // Same for the "debug" messages like board Found and Connected.
});

// http://johnny-five.io/api/button/

const johnnyFiveObjects = {};

board.on('ready', () => {
  // TODO: If we name the FILE we load to each Arduino differently,
  // then we can use THIS below to differentiate them, regardless of what port each is plugged in to or initializes first.
  // https://stackoverflow.com/a/34713418/4982408
  // console.log(board.io.firmware.name);
  // TODO: Do we need the node-pixel firmata on both boards?

  johnnyFiveObjects.digitalReadout2 = new five.Led.Digits({
    controller: 'HT16K33',
  });
  johnnyFiveObjects.digitalReadout1 = new five.Led.Digits({
    controller: 'HT16K33',
  });

  for (let i = 0; i < stationList.length; i++) {
    stationList[i].forEach((input) => {
      if (['switch', 'button'].indexOf(input.type) !== -1) {
        let isPullup = true;
        if (input.subType === 'arm') {
          isPullup = false;
        }
        johnnyFiveObjects[
          `${i}-${input.type}-${input.subType}-${input.id}`
        ] = new five.Button({
          pin: input.pin,
          isPullup,
        });
        johnnyFiveObjects[`${i}-${input.type}-${input.subType}-${input.id}`].on(
          'press',
          () => {
            input.hasBeenPressed = true;
            input.currentStatus = 'on';
            let soundName = '1';
            if (input.correct) {
              soundName = '328120__kianda__powerup';
              if (input.subType === 'big') {
                soundName = 'theOneButton';
              }
            }
            if (input.subType === 'arm') {
              soundName = '369867__samsterbirdies__radio-beep';
            }
            if (settings.debug) {
              console.log(`\nStation ${i + 1}`);
              console.log(input);
            }
            spawn('aplay', [`sounds/${soundName}.wav`]);
          },
        );
        johnnyFiveObjects[`${i}-${input.type}-${input.subType}-${input.id}`].on(
          'hold',
          () => {
            input.currentStatus = 'on';
          },
        );
        johnnyFiveObjects[`${i}-${input.type}-${input.subType}-${input.id}`].on(
          'release',
          () => {
            input.hasBeenPressed = true;
            input.currentStatus = 'off';
            if (input.type === 'switch') {
              let soundName = '4';
              if (input.correct) {
                soundName = '328120__kianda__powerup';
              }
              spawn('aplay', [`sounds/${soundName}.wav`]);
            }
          },
        );
      } else if (input.type === 'knob') {
        johnnyFiveObjects[
          `${i}-${input.type}-${input.subType}-${input.id}`
        ] = new five.Sensor({
          pin: input.pin,
          threshold: settings.potChangeThreshold, // This will emit a 'change' if it changes by this much.
          // freq: 250 // This will emit data every x milliseconds, even if no change has occured.
        });

        // Inject the `sensor` hardware into
        // the Repl instance's context;
        // allows direct command line access
        // board.repl.inject({
        //     pot: potentiometer
        // });

        // "data" get the current reading from the potentiometer
        /*
              potentiometer.on("data", function() {
                console.log(this.value, this.raw);
              });
              */

        johnnyFiveObjects[`${i}-${input.type}-${input.subType}-${input.id}`].on(
          'change',
          function() {
            input.hasBeenPressed = true;
            input.currentStatus = this.value;
            if (settings.debug) {
              console.log(`\nStation ${i + 1}`);
              console.log(input);
            }
            // console.log(input);
          },
        );
      }
      if (settings.debug) {
        // This prints out all button/switch labels at the start of the program.
        console.log(`Station ${i} input ${input.id} is ${input.label}.`);
      }
    });
  }

  gameState.boardInitiated = true;
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRange(int) {
  // TODO: Remove or narrow down so it doesn't confuse people when program thinks it is 'down' and user thinks it is 'left/right'
  // TODO: Might need to set debugging on to test the positions.
  // TODO: Can you get "in between"?
  const ranges = {
    down: { less: 10, greater: 950 },
    left: { less: 950, greater: 600 },
    up: { less: 600, greater: 300 },
    right: { less: 300, greater: 10 },
  };
  for (const vector in ranges) {
    if (int < ranges[vector].less && int > ranges[vector].greater) {
      // we found the right one
      return vector;
    } else if (ranges[vector].less < ranges[vector].greater) {
      if (int < ranges[vector].less || int > ranges[vector].greater) {
        return vector;
      }
    }
  }
}

function getRandVector() {
  const possibleVectors = ['up', 'left', 'right'];
  const rand = Math.floor(Math.random() * possibleVectors.length);
  return possibleVectors[rand];
}

function pad(num, size) {
  let s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

function updateDigitalReadout() {
  if (gameState.clockUpdate > 5) {
    const output = pad(
      gameState.maxTime * (1000 / settings.loopTime) - gameState.timeElapsed,
      4,
    );
    johnnyFiveObjects.digitalReadout1.print(output);
    johnnyFiveObjects.digitalReadout2.print(output);
    gameState.clockUpdate = 0;
  } else {
    gameState.clockUpdate++;
  }
}

function primaryGameLoop() {
  if (gameState.boardInitiated) {
    if (gameState.atGameIntro) {
      updateDigitalReadout();
      display.update({ state: 'intro' });
      if (
        stationList[0][0].currentStatus === 'on' &&
        stationList[1][0].currentStatus === 'on'
      ) {
        gameState.atGameIntro = false;
      }
    } else if (!gameState.gameStarted) {
      gameState.score = 0;
      display.update({ state: 'notStarted' });
      gameState.gameStarted = true;
    } else if (gameState.gameOver) {
      display.update({ state: 'gameOver', data: { score: gameState.score } });
      if (
        stationList[0][0].currentStatus === 'off' &&
        stationList[1][0].currentStatus === 'off'
      ) {
        gameState.gameOver = false;
        gameState.timeElapsed = 0;
        gameState.maxTime = gameState.initialTIme;
        gameState.score = 0;
        gameState.waitingForInput = false;
        gameState.player1done = false;
        gameState.player2done = false;
        gameState.gameStarted = false;
        gameState.atGameIntro = true;
      }
    } else if (
      gameState.maxTime * (1000 / settings.loopTime) - gameState.timeElapsed <
      1
    ) {
      display.update({ state: 'maxTimeReached' });
      johnnyFiveObjects.digitalReadout1.print('0000');
      johnnyFiveObjects.digitalReadout2.print('0000');
      gameState.gameOver = true;
    } else if (gameState.waitingForInput) {
      let done = false;
      let player1done =
        stationList[0][gameState.nextInstructionForSide1].hasBeenPressed;
      let player2done =
        stationList[1][gameState.nextInstructionForSide2].hasBeenPressed;

      if (
        player1done &&
        stationList[0][gameState.nextInstructionForSide1].type === 'knob'
      ) {
        if (
          getRange(
            stationList[0][gameState.nextInstructionForSide1].currentStatus,
          ) !== gameState.requiredKnobPosition1
        ) {
          player1done = false;
        }
      }

      if (
        player2done &&
        stationList[1][gameState.nextInstructionForSide2].type === 'knob'
      ) {
        if (stationList[1][gameState.nextInstructionForSide2].type === 'knob') {
          if (
            getRange(
              stationList[1][gameState.nextInstructionForSide2].currentStatus,
            ) !== gameState.requiredKnobPosition2
          ) {
            player2done = false;
          }
        }
      }

      if (player1done !== gameState.player1done) {
        gameState.player1done = player1done;
        if (player1done) {
          spawn('aplay', [`sounds/${settings.successSoundName}.wav`]);
        } else {
          // Display command again if the "player done" goes from true to false again.
          display.update({ state: 'generatingNextCommand' });
        }
      }

      if (player2done !== gameState.player2done) {
        gameState.player2done = player2done;
        if (player2done) {
          spawn('aplay', [`sounds/${settings.successSoundName}.wav`]);
        } else {
          // Display command again if the "player done" goes from true to false again.
          display.update({ state: 'generatingNextCommand' });
        }
      }

      if (player1done && player2done) {
        done = true;
      }

      if (done) {
        gameState.score++;
        gameState.waitingForInput = false;
        gameState.timeElapsed = 0;
        gameState.player1done = false;
        gameState.player2done = false;
        // MINIMUM TIME HERE:
        if (gameState.score > 5 && gameState.maxTime > 4) {
          gameState.maxTime--;
        } else if (gameState.score > 10 && gameState.maxTime > 3) {
          gameState.maxTime--;
        } else if (gameState.score > 20 && gameState.maxTime > 2) {
          gameState.maxTime--;
        }
      } else {
        if (!settings.noTimeOut) {
          gameState.timeElapsed++;
        }
        if (player1done && !player2done) {
          display.update({ state: 'player1done', data: gameState });
        } else if (player2done && !player1done) {
          display.update({ state: 'player2done', data: gameState });
        } else {
          // This does NOTHING on the LCD.
          display.update({ state: 'waitingForInput', data: gameState });
        }
      }
      updateDigitalReadout();
    } else if (!gameState.waitingForInput && !gameState.gameOver) {
      // This is where we come up with the NEXT command to request

      // Clear all inputs
      for (let i = 0; i < stationList.length; i++) {
        stationList[i].forEach((button) => {
          button.hasBeenPressed = false;
          button.correct = false;
        });
      }

      gameState.nextInstructionForSide1 = getRandomInt(
        1,
        stationList[0].length - 1,
      );
      while (
        gameState.lastThreeInputs.indexOf(gameState.nextInstructionForSide1) !==
        -1
      ) {
        gameState.nextInstructionForSide1 = getRandomInt(
          1,
          stationList[0].length - 1,
        );
      }
      gameState.lastThreeInputs[0] = gameState.lastThreeInputs[1];
      gameState.lastThreeInputs[1] = gameState.nextInstructionForSide1;

      gameState.nextInstructionForSide2 = getRandomInt(
        1,
        stationList[1].length - 1,
      );
      while (
        gameState.lastThreeInputs.indexOf(gameState.nextInstructionForSide2) !==
        -1
      ) {
        gameState.nextInstructionForSide2 = getRandomInt(
          1,
          stationList[1].length - 1,
        );
      }
      gameState.lastThreeInputs[2] = gameState.nextInstructionForSide2;

      let displayNameForStation1 =
        stationList[0][gameState.nextInstructionForSide1].label;
      stationList[0][gameState.nextInstructionForSide1].correct = true;
      let displayNameForStation2 =
        stationList[1][gameState.nextInstructionForSide2].label;
      stationList[1][gameState.nextInstructionForSide2].correct = true;

      for (let i = 0; i < 2; i++) {
        let nextInstruction = 'nextInstructionForSide1';
        if (i === 1) {
          nextInstruction = 'nextInstructionForSide2';
        }
        let knobDirection = getRandVector();
        while (
          knobDirection ===
          getRange(stationList[i][gameState[nextInstruction]].currentStatus)
        ) {
          knobDirection = getRandVector();
        }
        let displayName;
        if (stationList[i][gameState[nextInstruction]].type === 'button') {
          displayName = stationList[i][gameState[nextInstruction]].funName;
        } else if (
          stationList[i][gameState[nextInstruction]].type === 'switch'
        ) {
          if (
            stationList[i][gameState[nextInstruction]].currentStatus === 'on'
          ) {
            displayName = `Turn ${
              stationList[i][gameState[nextInstruction]].funName
            } Off.`;
          } else {
            displayName = `Turn ${
              stationList[i][gameState[nextInstruction]].funName
            } ON.`;
          }
        } else if (stationList[i][gameState[nextInstruction]].type === 'knob') {
          displayName = `Set ${
            stationList[i][gameState[nextInstruction]].funName
          } to ${stationList[i][gameState[nextInstruction]][knobDirection]}`;
        }
        if (i === 0) {
          displayNameForStation1 = displayName;
          gameState.displayNameForStation1 = displayName;
          gameState.requiredKnobPosition1 = knobDirection;
        } else {
          displayNameForStation2 = displayName;
          gameState.displayNameForStation2 = displayName;
          gameState.requiredKnobPosition2 = knobDirection;
        }
      }
      display.update({
        state: 'generatingNextCommand',
        data: { displayNameForStation1, displayNameForStation2 },
      });
      gameState.waitingForInput = true;
    } else {
      display.update({ state: 'crash' });
    }
  }
  setTimeout(primaryGameLoop, settings.loopTime);
}

primaryGameLoop();
