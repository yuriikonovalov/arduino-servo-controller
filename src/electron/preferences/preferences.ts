import Store from "electron-store";

const DEFAULT_ANGLE = 90;
const KEY_ANGLE = "angle";
const KEY_ANGLE_SERVO_CENTER_TO_NORTH = "angle_servo_center_to_north";

const store = new Store();

function getAngle(): number {
    try {
        return Number(store.get(KEY_ANGLE));
    } catch (e) {
        return DEFAULT_ANGLE;
    }
}

function getAngleOfServoCenterToNorth(): number {
    try {
        return Number(store.get(KEY_ANGLE_SERVO_CENTER_TO_NORTH));
    } catch (e) {
        return 0;
    }
}

let timeoutHandle: NodeJS.Timeout | null = null;

function setAngle(angle: number) {
    timeoutHandle?.close();
    timeoutHandle = setTimeout(() => {
        store.set(KEY_ANGLE, angle);
    }, 1000);
}

function setAngleOfServoCenterToNorth(angle: number) {
    store.set(KEY_ANGLE_SERVO_CENTER_TO_NORTH, angle);
}

export const preferences = {
    getAngle,
    setAngle,
    getAngleOfServoCenterToNorth,
    setAngleOfServoCenterToNorth
};