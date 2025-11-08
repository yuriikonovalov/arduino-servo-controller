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
    GET_PORTS: "GET_PORTS",
    CONNECT_TO_PORT: "CONNECT_TO_PORT",
    ON_PORT_DISCONNECTED: "ON_PORT_DISCONNECTED",
    GET_ANGLE_OF_SERVO_CENTER_TO_NORTH: "GET_ANGLE_OF_SERVO_CENTER_TO_NORTH",
    SET_ANGLE_OF_SERVO_CENTER_TO_NORTH: "SET_ANGLE_OF_SERVO_CENTER_TO_NORTH"
};

contextBridge.exposeInMainWorld("application", {
    increaseOnce: (): Promise<void> => ipcRenderer.invoke(IpcCommands.INCREASE_ONCE),
    decreaseOnce: (): Promise<void> => ipcRenderer.invoke(IpcCommands.DECREASE_ONCE),
    increaseStop: (): Promise<void> => ipcRenderer.invoke(IpcCommands.INCREASE_STOP),
    increaseStart: (): Promise<void> => ipcRenderer.invoke(IpcCommands.INCREASE_START),
    decreaseStop: (): Promise<void> => ipcRenderer.invoke(IpcCommands.DECREASE_STOP),
    decreaseStart: (): Promise<void> => ipcRenderer.invoke(IpcCommands.DECREASE_START),
    moveToCenter: (): Promise<void> => ipcRenderer.invoke(IpcCommands.MOVE_TO_CENTER),
    getPorts: (): Promise<any[]> => ipcRenderer.invoke(IpcCommands.GET_PORTS),
    onAngleChanged: (callback: (angle: number) => void): () => any => {
        const listener = (_: any, data: any) => callback(data);
        ipcRenderer.on(IpcCommands.ON_ARDUINO_ANGLE_CHANGED, listener);
        return () => ipcRenderer.off(IpcCommands.ON_ARDUINO_ANGLE_CHANGED, listener);
    },
    connectToPort: (path: string): Promise<boolean> => ipcRenderer.invoke(IpcCommands.CONNECT_TO_PORT, path),
    onPortDisconnected: (callback: () => void): () => any => {
        const listener = () => callback();
        ipcRenderer.on(IpcCommands.ON_PORT_DISCONNECTED, listener);
        return () => ipcRenderer.off(IpcCommands.ON_PORT_DISCONNECTED, listener);
    },
    getAngleOfServoCenterToNorth: (): Promise<number> => ipcRenderer.invoke(IpcCommands.GET_ANGLE_OF_SERVO_CENTER_TO_NORTH),
    setAngleOfServoCenterToNorth: (angle: number): Promise<void> => ipcRenderer.invoke(IpcCommands.SET_ANGLE_OF_SERVO_CENTER_TO_NORTH, angle)
} satisfies Window["application"]);