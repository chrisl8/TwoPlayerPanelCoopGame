const { exec } = require('child_process');
const settings = require('./settings');

const playSound = (sound) => {
  // amixer sset PCM,0 81%;aplay 3.wav
  exec(
    `amixer sset PCM,0 ${settings.volume.setting}%;aplay sounds/${sound}.wav`,
  );
};

module.exports = playSound;
