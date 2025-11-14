const {contextBridge, ipcRenderer} = require("electron");

// Just copied from ipcCommands.ts because cannot import as this file will end as a .cjs which be loaded at runtime.
const IpcCommands = {
    INCREASE_ONCE: "INCREASE_ONCE",
    DECREASE_ONCE: "DECREASE_ONCE",
    INCREASE_START: "INCREASE_START",
    INCREASE_STOP: "INCREASE_STOP",
    DECREASE_START: "DECREASE_START",
    DECREASE_STOP: "DECREASE_STOP",
    MOVE_TO_CENTER: "MOVE_TO_CENTER",
    ON_ARDUINO_ANGLE_CHANGED: "ON_ARDUINO_ANGLE_CHANGED",
    CONNECT: "CONNECT",
    DISCONNECT: "DISCONNECT",
    ON_DISCONNECTED: "ON_DISCONNECTED",
    SET_ANGLE_OF_SERVO_CENTER_TO_NORTH: "SET_ANGLE_OF_SERVO_CENTER_TO_NORTH",
    SET_IP_AND_PORT: "SET_IP_AND_PORT",
    SET_STEP: "SET_STEP",
    GET_SAVED_STATE: "GET_SAVED_STATE",
    ON_ERROR: "ON_ERROR"
};

contextBridge.exposeInMainWorld("application", {
    increaseOnce: (): Promise<void> => ipcRenderer.invoke(IpcCommands.INCREASE_ONCE),
    decreaseOnce: (): Promise<void> => ipcRenderer.invoke(IpcCommands.DECREASE_ONCE),
    increaseStop: (): Promise<void> => ipcRenderer.invoke(IpcCommands.INCREASE_STOP),
    increaseStart: (): Promise<void> => ipcRenderer.invoke(IpcCommands.INCREASE_START),
    decreaseStop: (): Promise<void> => ipcRenderer.invoke(IpcCommands.DECREASE_STOP),
    decreaseStart: (): Promise<void> => ipcRenderer.invoke(IpcCommands.DECREASE_START),
    moveToCenter: (): Promise<void> => ipcRenderer.invoke(IpcCommands.MOVE_TO_CENTER),
    onAngleChanged: (callback: (angle: number) => void): () => any => {
        const listener = (_: any, data: any) => callback(data);
        ipcRenderer.on(IpcCommands.ON_ARDUINO_ANGLE_CHANGED, listener);
        return () => ipcRenderer.off(IpcCommands.ON_ARDUINO_ANGLE_CHANGED, listener);
    },
    connect: (ip: string, port: number): Promise<boolean> => ipcRenderer.invoke(IpcCommands.CONNECT, ip, port),
    disconnect: (): Promise<void> => ipcRenderer.invoke(IpcCommands.DISCONNECT),
    onDisconnected: (callback: () => void): () => any => {
        const listener = () => callback();
        ipcRenderer.on(IpcCommands.ON_DISCONNECTED, listener);
        return () => ipcRenderer.off(IpcCommands.ON_DISCONNECTED, listener);
    },
    setAngleOfServoCenterToNorth: (angle: number): Promise<void> => ipcRenderer.invoke(IpcCommands.SET_ANGLE_OF_SERVO_CENTER_TO_NORTH, angle),
    setIpAndPort: (ip: string, port: number): Promise<void> => ipcRenderer.invoke(IpcCommands.SET_IP_AND_PORT, ip, port),
    setStep: (step: number): Promise<void> => ipcRenderer.invoke(IpcCommands.SET_STEP, step),
    getSavedState: (): Promise<{
        ip: string,
        port: number,
        step: number,
        angle: number,
        angleOfServoCenterToNorth: number
    }> => ipcRenderer.invoke(IpcCommands.GET_SAVED_STATE),
    onError: (callback: () => void): () => any => {
        ipcRenderer.on(IpcCommands.ON_ERROR, callback);
        return () => ipcRenderer.off(IpcCommands.ON_ERROR, callback);
    },
} satisfies Window["application"]);