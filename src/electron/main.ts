import {app, BrowserWindow, ipcMain, Menu} from "electron";
import path from "path";
import {isDev} from "./util.js";
import {getPreloadPath} from "./pathResolver.js";
import {IpcCommands} from "./ipc/ipcCommands.js";
import {ArduinoCommands} from "./arduino/arduinoCommands.js";
import {arduinoResponseHandler} from "./arduino/arduinoResponseHandler.js";
import {preferences} from "./preferences/preferences.js";
import {TCPClient} from "./tcp/TCPClient.js";


const tcpClient = new TCPClient();

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
        const angleWithServoCenterToNorthAngle = angle - preferences.getAngleOfServoCenterToNorth();
        mainWindow.webContents.send(IpcCommands.ON_ARDUINO_ANGLE_CHANGED, angleWithServoCenterToNorthAngle);
    });

    tcpClient.setArduinoResponseHandler(arduinoResponseHandler);
    tcpClient.setTCPClientListener({
        onDisconnected() {
            mainWindow.webContents.send(IpcCommands.ON_DISCONNECTED);
        },
        onError() {
            mainWindow.webContents.send(IpcCommands.ON_ERROR);
        }
    });

    ipcMain.handle(IpcCommands.INCREASE_ONCE, () => {
        tcpClient.sendCommand(ArduinoCommands.INCREASE_ANGLE_ONCE(preferences.getStep()));
    });

    ipcMain.handle(IpcCommands.DECREASE_ONCE, () => {
        tcpClient.sendCommand(ArduinoCommands.DECREASE_ANGLE_ONCE(preferences.getStep()));
    });

    ipcMain.handle(IpcCommands.INCREASE_START, () => {
        tcpClient.sendCommand(ArduinoCommands.INCREASE_ANGLE);
    });

    ipcMain.handle(IpcCommands.INCREASE_STOP, () => {
        tcpClient.sendCommand(ArduinoCommands.STOP);
    });

    ipcMain.handle(IpcCommands.DECREASE_START, () => {
        tcpClient.sendCommand(ArduinoCommands.DECREASE_ANGLE);
    });

    ipcMain.handle(IpcCommands.DECREASE_STOP, () => {
        tcpClient.sendCommand(ArduinoCommands.STOP);
    });

    ipcMain.handle(IpcCommands.MOVE_TO_CENTER, () => {
        tcpClient.sendCommand(ArduinoCommands.MOVE_TO_CENTER);
    });

    ipcMain.handle(IpcCommands.CONNECT, async (_, ip: string, port: number) => {
        const connected = await tcpClient.connect(ip, port);
        if (connected) {
            const initialAngle = preferences.getAngle();
            tcpClient.sendCommand(ArduinoCommands.INITIALIZE(initialAngle));
        }
        return connected;
    });

    ipcMain.handle(IpcCommands.SET_ANGLE_OF_SERVO_CENTER_TO_NORTH, async (_, angle: number) => {
        preferences.setAngleOfServoCenterToNorth(angle);
    });
    ipcMain.handle(IpcCommands.DISCONNECT, async () => {
        tcpClient.disconnect();
    });

    ipcMain.handle(IpcCommands.SET_IP_AND_PORT, async (_, ip: string, port: number) => {
        preferences.setIpAndPort(ip, port);
    });

    ipcMain.handle(IpcCommands.SET_STEP, async (_, step: number) => {
        preferences.setStep(step);
    });

    ipcMain.handle(IpcCommands.GET_SAVED_STATE, async () => {
        const {ip, port} = preferences.getIpAndPort();
        return {
            ip: ip,
            port: port,
            step: preferences.getStep(),
            angle: preferences.getAngle(),
            angleOfServoCenterToNorth: preferences.getAngleOfServoCenterToNorth()
        };
    });
}

app.on("ready", () => {
    const mainWindow = prepareMainWindow();
    setupIpc(mainWindow);
});