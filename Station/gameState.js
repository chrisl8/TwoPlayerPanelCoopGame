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
  displayNameForStation1: '',
  displayNameForStation2: '',
  score: 0,
  recentInputList: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Make this longer or shorter to reject a longer list of recent inputs
  timeElapsed: 0,
  maxTime: 10,
  clockUpdate: 0, // Used to regulate update of the clock, so we don't spam it and slow down the game
  player1done: false,
  player2done: false,
  statistics: [],
};

module.exports = gameState;
