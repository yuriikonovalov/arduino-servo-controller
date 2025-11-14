import Store from "electron-store";

const DEFAULT_ANGLE = 90;
const DEFAULT_ANGLE_SERVO_CENTER_TO_NORTH = 0;
const DEFAULT_STEP = 1;
const DEFAULT_IP = "192.168.0.50";
const DEFAULT_PORT = 5000;

const KEY_ANGLE = "angle";
const KEY_ANGLE_SERVO_CENTER_TO_NORTH = "angle_servo_center_to_north";
const KEY_STEP = "step";
const KEY_IP = "ip";
const KEY_PORT = "port";

const store = new Store();

let timeoutHandle: NodeJS.Timeout | null = null;

function setAngle(angle: number) {
    timeoutHandle?.close();
    timeoutHandle = setTimeout(() => {
        store.set(KEY_ANGLE, angle);
    }, 1000);
}

function getAngle(): number {
    try {
        return store.get(KEY_ANGLE, DEFAULT_ANGLE) as number;
    } catch (e) {
        return DEFAULT_ANGLE;
    }
}

function getAngleOfServoCenterToNorth(): number {
    try {
        return store.get(KEY_ANGLE_SERVO_CENTER_TO_NORTH, DEFAULT_ANGLE_SERVO_CENTER_TO_NORTH) as number;
    } catch (e) {
        return DEFAULT_ANGLE_SERVO_CENTER_TO_NORTH;
    }
}

function setAngleOfServoCenterToNorth(angle: number) {
    store.set(KEY_ANGLE_SERVO_CENTER_TO_NORTH, angle);
}

function setStep(step: number) {
    store.set(KEY_STEP, step);
}

function getStep(): number {
    try {
        return store.get(KEY_STEP, DEFAULT_STEP) as number;
    } catch (error) {
        return DEFAULT_STEP;
    }
}

function setIpAndPort(ip: string, port: number) {
    store.set(KEY_IP, ip);
    store.set(KEY_PORT, port);
}

function getIpAndPort(): { ip: string, port: number } {
    try {
        return {
            ip: store.get(KEY_IP, DEFAULT_IP) as string,
            port: store.get(KEY_PORT, DEFAULT_PORT) as number,
        };
    } catch (error) {
        return {
            ip: DEFAULT_IP,
            port: DEFAULT_PORT
        };
    }
}

export const preferences = {
    getAngle,
    setAngle,
    getAngleOfServoCenterToNorth,
    setAngleOfServoCenterToNorth,
    setStep,
    getStep,
    setIpAndPort,
    getIpAndPort
};