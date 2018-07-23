# Two Player Coop Panel

This is the code for our Two Player Coop Panel project. It is based on the "Push The Button" game built and coded for the 2018 Winter ICT Game Jam. That code can be seen at the [ictGameJamWinter2018](https://github.com/chrisl8/ictGameJamWinter2018) repository.

# Description

This game is a physical game, in that it is built with an Arduino and lots of buttons and switches.
You won't really be able to play it without building something.

This game is inspired by the mobile game SpaceTeam.

For my panel this code runs on a Raspberry Pi, although it works just as well on a PC. The Pi just allows me to make the project self contained.

## Running the game

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

To install, simply clone the repository into a local folder

```
$ git clone https://github.com/chrisl8/TwoPlayerPanelCoopGame.git
```

### Prerequisites

#### Node
In order to run this software locally, you will need to have [node.js](https://nodejs.org/) installed.

#### Arduino
The code itself is [Johnny-Five](http://johnny-five.io/) based, and requires Arduinos with the correct firmatta installed to read the button input, write the LED input, and communicate with this code running on your PC or Pi.

Because I am using code to control Neopixels, you need a different Firmata for the Neopixel library to work.
I wasn't able to make any of the automated programs written work,
so I did this:

1. Open up the Arduino program.
2. Open the file `TwoPlayerPanelCoopGame/Station/node_modules/node-pixel/firmware/build/node_pixel_firmata/node_pixel_firmata.ino` from the node_modules folder.
3. Upload it to the Arduino like any program.

If you just have the normal Firmata on the board instead of the special node_pixel version, you will get this error:
IncorrectFirmataVersionError: Please upload NodePixel Firmata to the board

### Run the program
Then run the `startGame.sh` script from the root of the repo. 

```
$ ./startGame.sh
```

It will initialize the node_modules folder on the first run.


NOTES:

Pins 6 & 7 are the lowest two pins I can seem to use the ARM switches on.
I'm not sure what is up with pins 0 to 5. Need to look that up.

Potentiometers must be powered with FIVE volts from Arduino, not the 3.3v line.

To use Analog pins as Digital, use a number by adding the next pin up (54) to the A number.

Using pins:
Switches: 32-53
Small Buttons: 2-5, 8-13, 22-31

Adding to crontab on pi
`@reboot ${HOME}/TwoPlayerPanelCoopGame/startGame.sh --service > ${HOME}/crontab.log 2>&1`
