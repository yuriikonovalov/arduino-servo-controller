import {app, BrowserWindow, ipcMain, Menu} from "electron";
import path from "path";
import {isDev} from "./util.js";
import {getPreloadPath} from "./pathResolver.js";
import {IpcCommands} from "./ipc/ipcCommands.js";
import {SerialPortManager} from "./serialPort/serialPortManager.js";
import {ArduinoCommands} from "./arduino/arduinoCommands.js";
import {arduinoResponseHandler} from "./arduino/arduinoResponseHandler.js";
import {preferences} from "./preferences/preferences.js";


const serialPortManager = new SerialPortManager(arduinoResponseHandler);

arduinoResponseHandler.setOnReadyCallback(() => {
    const initialAngle = preferences.getAngle();
    serialPortManager.sendCommand(ArduinoCommands.INITIALIZE(initialAngle));
});

function prepareMainWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {preload: getPreloadPath()}
    });

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }

    Menu.setApplicationMenu(null);
    return mainWindow;
}

function setupIpc(mainWindow: Electron.CrossProcessExports.BrowserWindow) {
    arduinoResponseHandler.setOnAppliedAngleCallback(angle => {
        preferences.setAngle(angle);
        const angleWithInitialPositionAngle = angle - preferences.getAngleOfServoCenterToNorth();
        mainWindow.webContents.send(IpcCommands.ON_ARDUINO_ANGLE_CHANGED, angleWithInitialPositionAngle);
    });

    serialPortManager.addOnPortDisconnectedListener(() => {
        mainWindow.webContents.send(IpcCommands.ON_PORT_DISCONNECTED);
    });

    ipcMain.handle(IpcCommands.INCREASE_ONCE, () => {
        serialPortManager.sendCommand(ArduinoCommands.INCREASE_ANGLE_ONCE);
    });

    ipcMain.handle(IpcCommands.DECREASE_ONCE, () => {
        serialPortManager.sendCommand(ArduinoCommands.DECREASE_ANGLE_ONCE);
    });

    ipcMain.handle(IpcCommands.INCREASE_START, () => {
        serialPortManager.sendCommand(ArduinoCommands.INCREASE_ANGLE);
    });

    ipcMain.handle(IpcCommands.INCREASE_STOP, () => {
        serialPortManager.sendCommand(ArduinoCommands.STOP);
    });

    ipcMain.handle(IpcCommands.DECREASE_START, () => {
        serialPortManager.sendCommand(ArduinoCommands.DECREASE_ANGLE);
    });

    ipcMain.handle(IpcCommands.DECREASE_STOP, () => {
        serialPortManager.sendCommand(ArduinoCommands.STOP);
    });

    ipcMain.handle(IpcCommands.MOVE_TO_CENTER, () => {
        serialPortManager.sendCommand(ArduinoCommands.MOVE_TO_CENTER);
    });

    ipcMain.handle(IpcCommands.GET_PORTS, async () => {
        return await serialPortManager.getAvailablePorts();
    });

    ipcMain.handle(IpcCommands.CONNECT_TO_PORT, async (_, path: string) => {
        return await serialPortManager.connect(path);
    });

    ipcMain.handle(IpcCommands.GET_ANGLE_OF_SERVO_CENTER_TO_NORTH, async () => {
        return preferences.getAngleOfServoCenterToNorth();
    });

    ipcMain.handle(IpcCommands.SET_ANGLE_OF_SERVO_CENTER_TO_NORTH, async (_, angle: number) => {
        preferences.setAngleOfServoCenterToNorth(angle);
    });
}

app.on("ready", () => {
    const mainWindow = prepareMainWindow();
    setupIpc(mainWindow);
});

app.on("before-quit", async () => {
    serialPortManager.removeOnPortDisconnectedListener();
    await serialPortManager.disconnect();
});
