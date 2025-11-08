// All the commands that the programmed Arduino board can handle.

const INITIALIZE = (angle: number) => {
    return angle < 0 || angle > 180 ? `INIT:90\n` : `INIT:${angle}\n`;
};

// Send opposite command to invert servo moving direction.
const INCREASE_ANGLE = "D\n";
const DECREASE_ANGLE = "I\n";
const INCREASE_ANGLE_ONCE = "D1";
const DECREASE_ANGLE_ONCE = "I1";

const STOP = "S\n";
const MOVE_TO_CENTER = "T90\n";

export const ArduinoCommands = {
    INITIALIZE,
    INCREASE_ANGLE,
    DECREASE_ANGLE,
    INCREASE_ANGLE_ONCE,
    DECREASE_ANGLE_ONCE,
    STOP,
    MOVE_TO_CENTER
};


export const ArduinoResponses = {
    READY: "READY",
    APPLIED_ANGLE: "A:"
};


