let lcd;
const port = '/dev/ttyACM1';
let savedState;

async function initialize() {
  if (!lcd) {
    console.log('LCD init');
    lcd = require('./LCD20x4');
    try {
      await lcd({ port, operation: 'clear' });
      await lcd({
        port,
        operation: 'text',
        row: 'line2',
        input: ' Booting Universe,',
      });
      await lcd({
        port,
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

async function update({ state, data }) {
  // TODO: Remember not to spam the display! Check that the new data is NEW before updating.
  if (savedState !== state) {
    savedState = state;
    switch (state) {
      case 'intro':
        await lcd({ operation: 'clear' });
        await lcd({
          port,
          operation: 'text',
          row: 'line2',
          input: '  Arm your station',
        });
        await lcd({
          port,
          operation: 'text',
          row: 'line3',
          input: '     to begin!',
        });
        break;
      case 'crash':
        await lcd({ operation: 'clear' });
        await lcd({
          port,
          operation: 'text',
          row: 'line1',
          input: `ERROR: Universe has crashed, please reboot it . . .`,
        });
        break;
      default:
        await lcd({ operation: 'clear' });
        await lcd({
          port,
          operation: 'text',
          row: 'line1',
          input: `ERROR: Universe has crashed, please reboot it . . .`,
        });
        break;
    }
  }
}
module.exports = {
  initialize,
  update,
};
