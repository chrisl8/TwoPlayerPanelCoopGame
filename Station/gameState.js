const gameState = {
  atGameIntro: true,
  gameStarted: false,
  gameOver: false,
  boardInitiated: false,
  waitingForInput: false,
  nextInstructionForSide1: 1,
  nextInstructionForSide2: 1,
  requiredKnobPosition1: null,
  requiredKnobPosition2: null,
  score: 0,
  lastThreeInputs: [0, 0, 0],
  timeElapsed: 0,
  initialTIme: 10,
  maxTime: 10,
  clockUpdate: 0,
};

module.exports = gameState;
