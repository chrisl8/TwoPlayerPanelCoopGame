#include "Arduino.h"

// Arduino serial help: https://forum.arduino.cc/index.php?topic=288234.0

// Run miniterm.py /dev/ttyACM0 9600 to talk to the arduino and send keys to it.

// You can load this via command line by:
// cd /home/chrisl8/Dropbox/Arduino/PanicStationsAndroidSerialSlave
// ~/bin/arduino/arduino --upload PanicStationsAndroidSerialSlave.ino
//     https://github.com/arduino/Arduino/blob/master/build/shared/manpage.adoc

// Testing Serial connection:
// miniterm.py /dev/ttyACM0 # Or whatever port it is on.

#include <FastLED.h>

// Could be any number, 255 makes debugging hard as it is the same as the
// endmarker for outgoing data.
#define READY_MARKER 128

#define SPECIAL_BYTE 253
#define START_MARKER 254
#define END_MARKER 255

#define PIXEL_STRING_PIN 6
#define NUM_PIXELS 53
#define CHAR_PER_PIXEL 3
#define RECV_LENGTH NUM_PIXELS *CHAR_PER_PIXEL
#define TEMP_BUFFER_LENGTH RECV_LENGTH * 2 // just to give it plenty of space
// #define RECV_LENGTH 159

CRGB pixels[NUM_PIXELS];

// Remember: If you are running the Neopixels from power from an Arduino,
// via a Raspberry Pi, you should keep the brightness down to avoid
// overloading the power supply.
uint8_t brightness = 10;

// https://forum.arduino.cc/index.php?topic=288234.0
uint16_t receivedBytes[RECV_LENGTH];

boolean newData = false;

void recvWithStartEndMarkers() {
  // https://stackoverflow.com/questions/572547/what-does-static-mean-in-c
  // 1. A static variable inside a function keeps its value between invocations.
  // 2. A static global variable or a function is "seen" only in the file it's
  // declared in
  static boolean recvInProgress = false;
  static uint16_t receiveIndex = 0;
  static uint16_t tempBuffer[TEMP_BUFFER_LENGTH];
  uint8_t rc;

  while (Serial.available() > 0 && newData == false) {
    rc = Serial.read();
    // Serial.write(rc); // for debugging

    if (recvInProgress == true) {
      if (rc != END_MARKER) {
        tempBuffer[receiveIndex] = rc;
        receiveIndex++;
        if (receiveIndex >= TEMP_BUFFER_LENGTH) {
          // Never overflow the buffer, even if we get too much data.
          receiveIndex = TEMP_BUFFER_LENGTH - 1;
        }
      } else {
        // Decode bytes above 252
        uint16_t dataRecvCount = 0;
        // Serial.write(receiveIndex); // for debugging
        for (uint16_t n = 0; n < receiveIndex && dataRecvCount < RECV_LENGTH;
             n++) {
          uint8_t x = tempBuffer[n];
          if (x == SPECIAL_BYTE) {
            n++;
            x = x + tempBuffer[n];
          }
          receivedBytes[dataRecvCount] = x;
          dataRecvCount++;
        }
        recvInProgress = false;
        newData = true;
      }
    } else if (rc == START_MARKER) {
      receiveIndex = 0;
      recvInProgress = true;
    }
  }
}

void dealWithNewData() {
  if (newData == true) {
    uint16_t index = 0;
    uint16_t pixel = 0;
    while (pixel < NUM_PIXELS) {
      pixels[pixel].setRGB(receivedBytes[index], receivedBytes[index + 1],
                           receivedBytes[index + 2]);
      pixel++;
      index += 3;
    }
    // Serial.write(pixel); // for debugging
    // Serial.write(index); // for debugging
    FastLED.show();
    newData = false;
  }
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  // put your setup code here, to run once:
  Serial.begin(115200); // Use serial input for some keyboard control.
                        // Adafruit Neopixel Strips:
  FastLED.addLeds<NEOPIXEL, PIXEL_STRING_PIN>(pixels, NUM_PIXELS);
  // Adafruit "Neopixel" individual LEDs
  // https://www.adafruit.com/product/1938
  // https://github.com/FastLED/FastLED/wiki/Rgb-calibration
  //  FastLED.addLeds<WS2811, PIXEL_STRING_PIN, RGB>(pixels, NUM_PIXELS);
  FastLED.setBrightness(brightness);

  // The shut off helps us see that a reset happened/worked
  // The blue helps us see that it is working
  for (uint8_t i = 0; i < NUM_PIXELS; i++) {
    pixels[i].setRGB(0, 0, 0);
  }
  FastLED.show();

  delay(100);

  for (uint8_t i = 0; i < NUM_PIXELS; i++) {
    pixels[i].setRGB(0, 0, 255);
  }
  FastLED.show();

  // Serial.println("<Arduino is ready>");
}

void loop() {
  recvWithStartEndMarkers();
  dealWithNewData();
  /* WARNING: Do NOT make this delay too long!
  / If it is too long (tested at 10 being TOO LONG), the receive buffer will
  overflow, / and data will be lost and the incoming streams will get combined
  in odd ways and / result in seemingly random data!! / As it stands, it seems
  to work fine with no delay.
  */
  // delay(1);
  Serial.write(READY_MARKER);
}
