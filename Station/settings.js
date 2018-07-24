const settings = {
  loopTime: 10,
  useScreen: false,
  useLCD: true,
  debug: false, // Use this to see input on screen
  potChangeThreshold: 25,
  station1port: '/dev/ttyACM1', // TODO: Can we detect these? Can we allow fixing from panel?
  station2port: '/dev/ttyACM2',
  noTimeOut: false, // Give unlimited time for each input. For testing.
  successSoundName: '328120__kianda__powerup',
  incorrectSoundName: 'error',
  bigButtonSoundName: 'theOneButton',
  armingSwitchSoundName: '369867__samsterbirdies__radio-beep',
  switchOffSoundName: '4',
  gameOverSoundName: 'lose',
  johnnyFiveRepl: false,
  johnnyFiveDebug: true,
  initialTime: 10, // How much time you start out with when the game beings.
};

module.exports = settings;
