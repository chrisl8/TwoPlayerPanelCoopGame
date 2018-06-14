// TODO: Make this work similar to the displayScreen.js for LCD

let lcd;

function initialize() {
  if (!lcd) {
    lcd = true;
    console.log('LCD init');
  }
}

function update() {}

module.exports = {
  initialize,
  update,
};
