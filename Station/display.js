const settings = require('./settings');
const screen = require('./displayScreen');
const lcd = require('./displayLCD');

function initialize() {
  if (settings.useScreen) {
    screen.initialize();
  }
  if (settings.useLCD) {
    lcd.initialize();
  }
}

function update(input) {
  if (settings.useLCD) {
    lcd.update(input);
  }
  if (settings.useScreen) {
    screen.update(input);
  }
}

module.exports = {
  initialize,
  update,
};
