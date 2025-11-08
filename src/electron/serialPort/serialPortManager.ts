import {ReadlineParser, SerialPort} from "serialport";
import {ArduinoResponseHandler} from "../arduino/arduinoResponseHandler.js";
import {PortData} from "../../../types.js";


export class SerialPortManager {
    private readonly baudRate: number = 115200;
    private readonly arduinoResponseHandler: ArduinoResponseHandler;
    private port: SerialPort | null = null;
    private parser: ReadlineParser | null = null;
    private onPortDisconnectedListener: (() => void) | null = null;

    constructor(handler: ArduinoResponseHandler) {
        this.arduinoResponseHandler = handler;
        this.monitorPortDisconnecting();
    }

    async connect(path: string): Promise<boolean> {
        if (this.port?.path === path) {
            await this.closeConnection();
        }
        return new Promise<boolean>((resolve, _) => {
            this.port = new SerialPort({path: path, baudRate: this.baudRate, autoOpen: true}, error => {
                this.initSerialDataParser();
                resolve(error === null);
            });
        });
    }


    sendCommand(command: string) {
        this.port?.write(command);
    }

    async disconnect(): Promise<void> {
        if (this.port === null) return;
        await this.closeConnection();
        this.port = null;
    }

    addOnPortDisconnectedListener(listener: () => void): void {
        this.onPortDisconnectedListener = listener;
    }

    removeOnPortDisconnectedListener(): void {
        this.onPortDisconnectedListener = null;
    }

    async getAvailablePorts(): Promise<PortData[]> {
        const list = await SerialPort.list();
        return list.map((item) => ({
            path: item.path,
            vendorId: item.vendorId,
            productId: item.productId,
            manufacturer: item.manufacturer,
            // @ts-ignore
            friendlyName: item.friendlyName
        }));
    }

    private async closeConnection(): Promise<void> {
        if (this.port === null || !this.port.isOpen) return;
        return new Promise<void>((resolve, reject) => {
            this.port?.close(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private monitorPortDisconnecting() {
        setInterval(async () => {
            const currentPort = this.port;
            if (currentPort !== null) {
                const ports = await this.getAvailablePorts();
                const result = ports.find(port => port.path === currentPort.path);
                if (result === undefined) {
                    this.onPortDisconnectedListener?.();
                    await this.disconnect();
                }
            }
        }, 2000);
    }

    private initSerialDataParser() {
        if (this.port !== null) {
            this.parser = this.port.pipe(new ReadlineParser({delimiter: '\r\n'}));
            this.parser.on("data", data => this.arduinoResponseHandler.handle(data));
        }
    }
}