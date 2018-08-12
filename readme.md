# Panic Stations

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
$ git clone https://github.com/chrisl8/PanicStations.git
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
2. Open the file `PanicStations/Station/node_modules/node-pixel/firmware/build/node_pixel_firmata/node_pixel_firmata.ino` from the node_modules folder.
3. Upload it to the Arduino like any program.

If you just have the normal Firmata on the board instead of the special node_pixel version, you will get this error:
IncorrectFirmataVersionError: Please upload NodePixel Firmata to the board

### Run the program
Then run the `startGame.sh` script from the root of the repo. 

```
$ ./startGame.sh
```

It will initialize the node_modules folder on the first run.

### Version 1.0 Improvements:
    * Better box with fancy metalic looking paint.
    * Character Displays on board so you don't have to look up at a monitor/TV to get your directions.
    * 10 buttons per side instead of 5
    * 11 switches per side instead of 5
    * More "randomized" pattern for layout
    * Lots of playability improvements in the code, but the game play logic is still the same.
        * Positive "SUCCESS" confirmation when you perform your task before your team mate does.
        * Knobs register when they leave the correct zone before your team mate performs their command

### Future Enhancements
    * Lights on the switches and the knobs
        * That is what the extra holes are for.
    * Integrated speakers
        * Now you have to plug in an external set of speakers if you want sound
        * Sound is not required to play the game.
    * Improved text and "interactivity" from system as you do things.
    * Alternate game modes
        * Self driven Demo mode that just flasehs lights
        * User driven demo mode where it just makes sounds and flashes lights when you push buttons an dturn knows.
        * Use lights to "signal" which thing to switch when time runs short.
        * Mode with no commands, just lights to say "push this"
        * Single player mode
        * Competitive mode?
            * Not really sure how to do this.

### NOTES:

Pins 6 & 7 are the lowest two pins I can seem to use the ARM switches on.
I'm not sure what is up with pins 0 to 5. Need to look that up.

Potentiometers must be powered with FIVE volts from Arduino, not the 3.3v line.

To use Analog pins as Digital, use a number by adding the next pin up (54) to the A number.

Using pins:
Switches: 32-53
Small Buttons: 2-5, 8-13, 22-31

Adding to crontab on pi
`@reboot ${HOME}/PanicStations/startGame.sh --service > ${HOME}/crontab.log 2>&1`
