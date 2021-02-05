const formatGridText = require('./formatGridText');
const lcd = require('./LCD20x4');

async function formatAndSendToLCD({ text, portObj }) {
  const formattedText = formatGridText({ text, columns: 20, rows: 4 });
  for (let i = 0; i < formattedText.length; i++) {
    if (formattedText[i] !== '') {
      await lcd.display({
        portObj,
        operation: 'text',
        row: `line${i + 1}`,
        input: formattedText[i],
      });
    }
  }
}

module.exports = formatAndSendToLCD;
