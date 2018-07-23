const lcd = require('./LCD20x4');
const wait = require('./wait');
const formatAndSendToLCD = require('./formatAndSendToLCD');
const gameState = require('./gameState');
const stationList = require('./stationList');

class DisplayLCD {
  constructor(port = '/dev/ttyACM1') {
    this.port = port;
  }

  async initialize() {
    if (!this.portObj) {
      console.log('LCD init');
      this.portObj = lcd.getPortObject(this.port);
      try {
        await lcd.display({ portObj: this.portObj, operation: 'clear' });
        await lcd.display({
          portObj: this.portObj,
          operation: 'text',
          row: 'line2',
          input: ' Booting Universe,',
        });
        await lcd.display({
          portObj: this.portObj,
          operation: 'text',
          row: 'line3',
          input: ' please stand by...',
        });
      } catch (e) {
        console.error('LCD Init error:');
        console.error(e);
      }
    }
  }

  async update({ state, data, station }) {
    // TODO: Remember not to spam the display! Check that the new data is NEW before updating.
    if (this.savedState !== state) {
      while (!this.portObj) {
        // Wait for any existing operations to finish before running this one.
        // eslint-disable-next-line no-await-in-loop
        await wait(1);
      }
      this.savedState = state;
      console.log(state);
      switch (state) {
        case 'intro':
          await lcd.display({ portObj: this.portObj, operation: 'clear' });
          await lcd.display({
            portObj: this.portObj,
            operation: 'text',
            row: 'line2',
            input: '  Arm your station',
          });
          await lcd.display({
            portObj: this.portObj,
            operation: 'text',
            row: 'line3',
            input: '     to begin!',
          });
          break;
        case 'notStarted':
          await lcd.display({ portObj: this.portObj, operation: 'clear' });
          await lcd.display({
            portObj: this.portObj,
            operation: 'text',
            row: 'line2',
            input: '     Get ready!     ',
          });
          break;
        case 'gameOver':
          await lcd.display({ portObj: this.portObj, operation: 'clear' });
          await lcd.display({
            portObj: this.portObj,
            operation: 'text',
            row: 'line1',
            input: '     GAME OVER',
          });
          await lcd.display({
            portObj: this.portObj,
            operation: 'text',
            row: 'line2',
            input: `   YOUR SCORE: ${data.score}`,
          });
          await lcd.display({
            portObj: this.portObj,
            operation: 'text',
            row: 'line3',
            input: ' Please DISARM both',
          });
          await lcd.display({
            portObj: this.portObj,
            operation: 'text',
            row: 'line4',
            input: ' sides to try again',
          });
          // }
          break;
        case 'player1done':
          if (station === 1) {
            await lcd.display({ portObj: this.portObj, operation: 'clear' });
            await lcd.display({
              portObj: this.portObj,
              operation: 'text',
              row: 'line2',
              input: `      SUCCESS!`,
            });
          }
          break;
        case 'player2done':
          if (station === 2) {
            await lcd.display({ portObj: this.portObj, operation: 'clear' });
            await lcd.display({
              portObj: this.portObj,
              operation: 'text',
              row: 'line2',
              input: `      SUCCESS!`,
            });
          }
          break;
        case 'maxTimeReached':
          await lcd.display({ portObj: this.portObj, operation: 'clear' });
          break;
        case 'waitingForInput':
          break;
        case 'generatingNextCommand':
          if (station === 1 && !gameState.player1done) {
            await lcd.display({ portObj: this.portObj, operation: 'clear' });
            await formatAndSendToLCD({
              portObj: this.portObj,
              text: gameState.displayNameForStation1,
            });
          }
          if (station === 2 && !gameState.player2done) {
            await lcd.display({ portObj: this.portObj, operation: 'clear' });
            await formatAndSendToLCD({
              portObj: this.portObj,
              text: gameState.displayNameForStation2,
            });
          }
          break;
        case 'crash':
          await lcd.display({ portObj: this.portObj, operation: 'clear' });
          await formatAndSendToLCD({
            portObj: this.portObj,
            text: `ERROR: Universe has crashed, please reboot it . . .`,
          });
          break;
        default:
          await lcd.display({ portObj: this.portObj, operation: 'clear' });
          await formatAndSendToLCD({
            portObj: this.portObj,
            text: `ERROR: Universe has crashed, please reboot it . . .`,
          });
          break;
      }
    }
  }
}

module.exports = DisplayLCD;
