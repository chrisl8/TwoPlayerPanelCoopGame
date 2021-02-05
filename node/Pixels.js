// The Arduino THIS code connects to must run the program:
// Arduino/PanicStationsAndroidSerialSlave.ino

// Originally based on
// https://github.com/chrisl8/ArloBot/blob/new-serial-interface/node/Arduino.js

const SerialPort = require('serialport');

// const Readline = SerialPort.parsers.Readline;
const ByteLength = SerialPort.parsers.ByteLength;
const pack = require('jspack').jspack;
const settings = require('./settings');
const wait = require('./wait');

function flatten(arr) {
  // https://stackoverflow.com/a/15030117/4982408
  return arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    [],
  );
}

// Adjustable constants for the board:
const port = settings.neopixelArduinoPort.name;
const baudRate = 115200;
const retrySendDelay = 15;
// Could be any number, 255 makes debugging hard as it is the same as the endmarker for outgoing data.
const arduinoReadyMarker = 128;
const specialByte = 253;
const startMarker = 254;
const endMarker = 255;

class Pixels {
  /** @namespace personalData.relays.has_arduino */

  /** @namespace personalData.arduinoUniqueString */
  /** @namespace personalData.arduinoStringLocation */
  constructor(runFromCommandLine) {
    this.programIsBusy = false; // Prevent multiple instances from running at once in the same program
    this.arduinoReady = false;
    this.repeatTimeout = null;
    this.runFromCommandLine = runFromCommandLine;
    this.port = null;
  }

  encodeHighBytes(inputBytes) {
    const outputBytes = [];
    for (let i = 0; i < inputBytes.length; i++) {
      if (inputBytes[i] >= specialByte) {
        outputBytes.push(specialByte);
        outputBytes.push(inputBytes[i] - specialByte);
      } else {
        outputBytes.push(inputBytes[i]);
      }
    }
    return outputBytes;
  }

  sendCommandToArduino(inputArray) {
    if (this.repeatTimeout) {
      clearTimeout(this.repeatTimeout);
    }
    if (!this.arduinoReady) {
      this.repeatTimeout = setTimeout(() => {
        this.sendCommandToArduino(inputArray);
      }, retrySendDelay);
    } else {
      this.arduinoReady = false;
      if (this.runFromCommandLine) {
        console.log(`SEND ${inputArray.join(',')} - ${inputArray.length}`);
      }
      const dataToSend = this.encodeHighBytes(inputArray);
      dataToSend.unshift(startMarker);
      dataToSend.push(endMarker);
      let packetFormat = '<'; // little endian and opening character.
      for (let i = 0; i < dataToSend.length; i++) {
        packetFormat = `${packetFormat}B`;
      }
      const commandToSend = pack.Pack(packetFormat, dataToSend);
      if (this.runFromCommandLine) {
        console.log(
          `SENT ${commandToSend.join(',')} - ${commandToSend.length}`,
        );
      }
      this.port.write(commandToSend, (err) => {
        // Argument Options: err, result
        if (err) {
          console.log(`Write ERROR: ${err}`);
        }
      });
    }
  }

  async init() {
    // See Camera.js for example
    if (!this.programIsBusy) {
      this.programIsBusy = true;

      this.port = new SerialPort(
        port,
        {
          baudRate,
        },
        (error) => {
          if (error) {
            console.error('Arduino connect error:');
            console.error(error);
          }
        },
      );

      // The Arduino resets when you connect the serial port.
      // If you don't wait a bit before starting to write to it,
      // You will cause it to hang for ten seconds
      // By waiting 1 second to instantiate the listener,
      // we wait 1 second to set arduinoReady,
      // and hence 1 second before we write to it.
      await wait(1000);

      console.log('Arduino port opening.');

      // this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
      this.parser = this.port.pipe(new ByteLength({ length: 1 }));
      this.parser.on('data', (data) => {
        const receivedData = [...data];
        if (this.runFromCommandLine) {
          receivedData.forEach((byte) => {
            if (byte !== arduinoReadyMarker) {
              console.log(byte);
            }
          });
        }
        if (!this.arduinoReady && receivedData[0] === arduinoReadyMarker) {
          if (this.runFromCommandLine) {
            console.log('READY');
          }
          this.arduinoReady = true;
        }
      }); // will have 8 bytes per data event

      this.port.on('close', () => {
        console.log('Arduino connection closed.');
        this.pause();
        this.port = null;
        this.programIsBusy = false;
      });
    }
  }

  pause() {
    this.arduinoReady = false;
    if (this.repeatTimeout) {
      clearTimeout(this.repeatTimeout);
    }
  }
}

module.exports = Pixels;
if (require.main === module) {
  (async () => {
    // Run the function if this is called directly instead of required as a module.
    const pixels = new Pixels(true);
    pixels.init();
    await wait(500);
    const middlePixel = Math.ceil(settings.scoreKeeperPixelCount / 2) - 1;
    let position = 0;
    let atCenter = false;
    // noinspection InfiniteLoopJS
    while (true) {
      if (position > middlePixel) {
        position = 0;
      }
      let inputArray = [];
      for (let i = 0; i < settings.scoreKeeperPixelCount; i++) {
        if (
          i <= position ||
          i >= settings.scoreKeeperPixelCount - position - 1
        ) {
          inputArray[i] = [0, 255, 0];
          if (i === middlePixel) {
            inputArray[i] = [255, 0, 0];
            atCenter = true;
          }
        } else {
          inputArray[i] = [0, 0, 0];
        }
      }
      position++;
      inputArray = flatten(inputArray);
      pixels.sendCommandToArduino(inputArray);
      /* NOTE About Timing:
       * Any waitTime shorter than 21 milliseconds results in periodic,
       * errors, and random looking LED output.
       * I saw zero errors at 21ms though. it is very reliable.
       * This number could increase if the LED count increases? I'm not sure.
       */
      let waitTime = 21;
      if (atCenter) {
        waitTime = 100;
        atCenter = false;
      }
      // eslint-disable-next-line no-await-in-loop
      await wait(waitTime);
    }
    // inputArray = [254, 0, 0, 0, 255, 0, 0, 0, 254, 0, 0, 0, 254, 254, 254];
    // pixels.sendCommandToArduino(inputArray);
    // await wait(100);
    // inputArray = [0, 254, 0, 0, 254, 0, 0, 254, 0, 0, 255, 0, 0, 254, 0];
    // pixels.sendCommandToArduino(inputArray);
    // await wait(100);
    // inputArray = [254, 0, 0, 254, 0, 0, 254, 0, 0, 255, 0, 0, 254, 0, 0];
    // pixels.sendCommandToArduino(inputArray);
    // const chaseTest = [
    //   [0, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0],
    //   [0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 254, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0],
    // ];
    // let position = 0;
    // // eslint-disable-next-line no-constant-condition
    // // noinspection InfiniteLoopJS
    // while (true) {
    //   // eslint-disable-next-line no-await-in-loop
    //   await wait(40);
    //   pixels.sendCommandToArduino(chaseTest[position].slice());
    //   position++;
    //   if (position >= chaseTest.length) {
    //     position = 0;
    //   }
    // }
  })();
}
