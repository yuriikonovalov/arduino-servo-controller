function buildMoveOnceCommand(command: "D" | "I" | "INIT", angle: number): string {
    let normalizedAngle = angle;
    if (angle < 0) normalizedAngle = 0;
    if (angle > 180) normalizedAngle = 180;
    return `${command}:${normalizedAngle}\n`;
}

// All the commands that the programmed Arduino board can handle.
const INITIALIZE = (angle: number) => buildMoveOnceCommand("INIT", angle);
const STOP = "S\n";
const MOVE_TO_CENTER = "T90\n";
// Send opposite command to invert servo moving direction.
const INCREASE_ANGLE = "D\n";
const DECREASE_ANGLE = "I\n";
const INCREASE_ANGLE_ONCE = (angle: number) => buildMoveOnceCommand("D", angle);
const DECREASE_ANGLE_ONCE = (angle: number) => buildMoveOnceCommand("I", angle);

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
    APPLIED_ANGLE: "A:"
};


