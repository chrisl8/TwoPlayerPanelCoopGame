const stationList = [];

stationList.push([
    {
        id: 1,
        pin: 33,
        type: "switch",
        subType: "arm",
        label: "Arm",
        description: "Big toggle switch with cover",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 2,
        pin: 32,
        type: "button",
        subType: "big",
        label: "Big Button",
        funName: "Push THE ONE BUTTON! NOW!",
        description: "Large round button",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 3,
        pin: 'A0',
        type: "knob",
        label: "Red Knob 3",
        description: "Red knob",
        currentStatus: null,
        hasBeenPressed: false,
        currentSetting: null,
        previousSetting: null,
        funName: "Reactor Level",
        up: "1",
        down: "3",
        left: "4",
        right: "2",
    },
    {
        id: 4,
        pin: 'A1',
        type: "knob",
        label: "Blue Knob 2",
        description: "Blue knob",
        currentStatus: null,
        hasBeenPressed: false,
        currentSetting: null,
        previousSetting: null,
        funName: "System Language",
        up: "Kilog",
        down: "Binary",
        left: "Tech B",
        right: "Standard",
    },
    {
        id: 5,
        pin: 'A2',
        type: "knob",
        label: "White Knob 1",
        description: "White knob",
        currentStatus: null,
        hasBeenPressed: false,
        currentSetting: null,
        previousSetting: null,
        funName: "Chores",
        up: "Laundry",
        down: "Kitchen",
        left: "Trash",
        right: "Protesting",
    },
    {
        id: 6,
        pin: 27,
        type: "switch",
        subType: "small",
        label: "Switch 1",
        funName: "Focus Group Tester",
        description: "Far Left Switch",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 7,
        pin: 28,
        type: "switch",
        subType: "small",
        label: "Switch 2",
        funName: "Overdrive",
        description: "Second Switch From the Left",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 8,
        pin: 29,
        type: "switch",
        subType: "small",
        label: "Switch 3",
        funName: "Cry for Help",
        description: "Middle Switch",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 9,
        pin: 30,
        type: "switch",
        subType: "small",
        label: "Switch 4",
        funName: "Bulkheads",
        description: "Second Switch from the Right",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 10,
        pin: 31,
        type: "switch",
        subType: "small",
        label: "Switch 5",
        funName: "Judging Machine",
        description: "Far Right Switch",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 11,
        pin: 22,
        type: "button",
        subType: "small",
        label: "Button 1",
        funName: "Punch Hole in Universe",
        description: "Far Left Small Button",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 12,
        pin: 23,
        type: "button",
        subType: "small",
        label: "Button 2",
        funName: "Crash Thermostat",
        description: "Second Small Button From the Left",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 13,
        pin: 24,
        type: "button",
        subType: "small",
        label: "Button 3",
        funName: "Go Home",
        description: "Middle Small Button",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 14,
        pin: 25,
        type: "button",
        subType: "small",
        label: "Button 4",
        funName: "Distribute stress balls",
        description: "Second Small Button from the Right",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 15,
        pin: 26,
        type: "button",
        subType: "small",
        label: "Button 5",
        funName: "pulse the microthruster",
        description: "Far Right Small Button",
        currentStatus: null,
        hasBeenPressed: false,
    },
]);

stationList.push([
    {
        id: 1,
        pin: 42,
        type: "switch",
        subType: "arm",
        label: "Arm",
        description: "Big toggle switch with cover",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 2,
        pin: 43,
        type: "button",
        subType: "big",
        label: "Big Button",
        funName: "Push THE ONE BUTTON! NOW!",
        description: "Large round button",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 3,
        pin: "A3",
        type: "knob",
        label: "Red Knob 3",
        description: "Red knob",
        currentStatus: null,
        hasBeenPressed: false,
        currentSetting: null,
        previousSetting: null,
        funName: "Compatibility",
        up: "1",
        down: "3",
        left: "4",
        right: "2",
    },
    // {
    //     id: 4,
    //     pin: "A4",
    //     type: "knob",
    //     label: "Blue Knob 2",
    //     description: "Blue knob",
    //     currentStatus: null,
    //     hasBeenPressed: false,
    //     currentSetting: null,
    //     previousSetting: null,
    // funName: "Demand",
    // up: "Kitten",
    // down: "Friend",
    // left: "Sustenance",
    // right: "Stress Blanket",
    // },
    {
        id: 5,
        pin: "A5",
        type: "knob",
        label: "White Knob 1",
        description: "White knob",
        currentStatus: null,
        hasBeenPressed: false,
        currentSetting: null,
        previousSetting: null,
        funName: "Repair",
        up: "Maintenance Drone",
        down: "Paradox",
        left: "Hull",
        right: "Stress ball",
    },
    {
        id: 6,
        pin: 48,
        type: "switch",
        subType: "small",
        label: "Switch 1",
        funName: "Gyro locking",
        description: "Far Left Switch",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 7,
        pin: 47,
        type: "switch",
        subType: "small",
        label: "Switch 2",
        funName: "Excuse Generator",
        description: "Second Switch From the Left",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 8,
        pin: 46,
        type: "switch",
        subType: "small",
        label: "Switch 3",
        funName: "Super Special MEGA THINGY",
        description: "Middle Switch",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 9,
        pin: 45,
        type: "switch",
        subType: "small",
        label: "Switch 4",
        funName: "Brick Order",
        description: "Second Switch from the Right",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 10,
        pin: 44,
        type: "switch",
        subType: "small",
        label: "Switch 5",
        funName: "Over Analyzer",
        description: "Far Right Switch",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 11,
        pin: 49,
        type: "button",
        subType: "small",
        label: "Button 1",
        funName: "Do The Thing!",
        description: "Far Left Small Button",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 12,
        pin: 50,
        type: "button",
        subType: "small",
        label: "Button 2",
        funName: "Stabilize Crew",
        description: "Second Small Button From the Left",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 13,
        pin: 51,
        type: "button",
        subType: "small",
        label: "Button 3",
        funName: "Give up . . . :(",
        description: "Middle Small Button",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 14,
        pin: 52,
        type: "button",
        subType: "small",
        label: "Button 4",
        funName: "Hack the Microwave",
        description: "Second Small Button from the Right",
        currentStatus: null,
        hasBeenPressed: false,
    },
    {
        id: 15,
        pin: 53,
        type: "button",
        subType: "small",
        label: "Button 5",
        funName: "Summon Silicon!!!",
        description: "Far Right Small Button",
        currentStatus: null,
        hasBeenPressed: false,
    },
]);

module.exports = stationList;
