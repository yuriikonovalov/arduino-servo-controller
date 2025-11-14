import {create} from "zustand";

type ApplicationState = {
    ip: string,
    port: string,
    connected: boolean,
    connecting: boolean,
    angleOfServoCenterToNorth: number,
    angle: number,
    step: number,
    stepOptions: number[]
}

type ApplicationAction = {
    setIp: (ip: string) => void,
    setPort: (port: string) => void,
    setConnected: (connected: boolean) => void,
    setConnecting: (connecting: boolean) => void,
    setAngleOfServoCenterToNorth: (angle: number) => void,
    setAngle: (angle: number) => void,
    setStep: (step: number) => void,
    setSavedState: (
        ip: string, port: number, step: number, angle: number, angleOfServoCenterToNorth: number
    ) => void
}

type ApplicationStore = ApplicationState & ApplicationAction

const STEP_OPTIONS = [1, 3, 5];

const useStore = create<ApplicationStore>((set, get) => ({
    ip: "",
    port: "",
    connected: false,
    connecting: false,
    angleOfServoCenterToNorth: 0,
    // Considering that the servo initially is set to 90 degrees which is the middle.
    angle: 90,
    step: 1,
    stepOptions: STEP_OPTIONS,

    setIp: (ip: string) => {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
        const isIpValid = ip.match(ipv4Regex) !== null;
        if (isIpValid || ip.trim() === "") {
            set({ip: ip});
        }
    },
    setPort: (port: string) => {
        if ((port.match(/^[0-9]+$/) !== null) || port.toString() === "") {
            set({port: port});
        }
    },
    setConnected: (connected: boolean) => set({connected: connected}),
    setConnecting: (connecting: boolean) => set({connecting: connecting}),
    setAngleOfServoCenterToNorth: (angle: number) => {
        const currentAngle = get().angle;
        const previousAngleOfServoCenterToNorth = get().angleOfServoCenterToNorth;
        set({
            angleOfServoCenterToNorth: angle,
            angle: currentAngle - (angle - previousAngleOfServoCenterToNorth)
        });
    },
    setAngle: (angle: number) => set({angle: angle}),
    setStep: (step: number) => set({step: step}),
    setSavedState: (
        ip: string, port: number, step: number, angle: number, angleOfServoCenterToNorth: number
    ) => set({
        ip: ip,
        port: port.toString(),
        step: step,
        angle: angle,
        angleOfServoCenterToNorth: angleOfServoCenterToNorth
    })
}));

const useIp = () => useStore(store => store.ip);
const getIpAndPort = () => ({
    ip: useStore.getState().ip,
    port: useStore.getState().port
});
const usePort = () => useStore(store => store.port);
const angleOfServoCenterToNorth = () => useStore(store => store.angleOfServoCenterToNorth);
const getAngleForRendering = () => useStore.getState().angle;
const useAngleForDisplaying = () => useStore(store => {
    // Considering servo's 90 degrees angle as the middle.
    // User will see it as 0 degree. The servo can go from -90 to 90 degrees.
    let normalizedAngle = 90 - store.angle;
    while (normalizedAngle < 0) {
        normalizedAngle = 360 + normalizedAngle;
    }
    while (normalizedAngle > 360) {
        normalizedAngle = normalizedAngle - 360;
    }
    return normalizedAngle;
});
const useConnected = () => useStore(store => store.connected);
const useConnecting = () => useStore(store => store.connecting);
const useStep = () => useStore(store => store.step);
const useStepOptions = () => useStore(store => store.stepOptions);


const useSetIp = () => useStore(store => store.setIp);
const useSetPort = () => useStore(store => store.setPort);
const useSetConnected = () => useStore(store => store.setConnected);
const setAngleOfServoCenterToNorth = () => useStore(store => store.setAngleOfServoCenterToNorth);
const useSetAngle = () => useStore(store => store.setAngle);
const useSetConnecting = () => useStore(store => store.setConnecting);
const useSetStep = () => useStore(store => store.setStep);
const useSetSavedState = () => useStore(store => store.setSavedState);

export const applicationStore = {
    useIp,
    usePort,
    getIpAndPort,
    angleOfServoCenterToNorth,
    useAngleForDisplaying,
    getAngleForRendering,
    useConnected,
    useConnecting,
    useStep,
    useStepOptions
};

export const applicationAction = {
    useSetIp,
    useSetPort,
    useSetConnected,
    setAngleOfServoCenterToNorth,
    useSetAngle,
    useSetConnecting,
    useSetStep,
    useSetSavedState
};