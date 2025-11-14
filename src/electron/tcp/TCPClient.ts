import {ArduinoResponseHandler} from "../arduino/arduinoResponseHandler.js";
import {Socket} from "node:net";
import {TCPClientListener} from "./TCPClientListener.js";


export class TCPClient {
    private arduinoResponseHandler: ArduinoResponseHandler | null = null;
    private listener: TCPClientListener | null = null;
    private socket: Socket | null = null;

    setArduinoResponseHandler(handler: ArduinoResponseHandler): void {
        this.arduinoResponseHandler = handler;
    }

    setTCPClientListener(listener: TCPClientListener): void {
        this.listener = listener;
    }

    async connect(ip: string, port: number): Promise<boolean> {
        if (this.socket && !this.socket.closed) {
            this.destroyClient();
        }
        return new Promise<boolean>((resolve, _) => {
            this.socket = new Socket();
            this.setErrorListener();
            this.socket.addListener("connectionAttemptFailed", () => {
                resolve(false);
                this.destroyClient();
            });
            this.socket.connect(port, ip, () => {
                this.setDataParser();
                this.setConnectionClosedListener();
                resolve(true);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.destroy();
        }
    }

    sendCommand(command: string) {
        this.socket?.write(command);
    }

    private destroyClient(): void {
        const client = this.socket;
        if (client === null || client.closed) return;
        this.socket = null;
    }

    private setConnectionClosedListener() {
        if (this.socket !== null) {
            this.socket.on("close", () => {
                this.destroyClient();
                this.listener?.onDisconnected();
            });
        }
    }

    private setDataParser() {
        if (this.socket !== null) {
            this.socket.on("data", (data) => {
                this.arduinoResponseHandler?.handle(data);
            });
        }
    }

    private setErrorListener() {
        if (this.socket !== null) {
            this.socket.on("error", (error: any) => {
                if (error.code === "ETIMEDOUT" && error.syscall === "connect") {
                    // This is the error if connecting failed.
                    // It's handled withing the 'connect' method, no needed to notify from here.
                    return;
                }
                if (error.code === "ECONNRESET") {
                    this.disconnect();
                } else {
                    this.listener?.onError();
                }
            });
        }
    }
}