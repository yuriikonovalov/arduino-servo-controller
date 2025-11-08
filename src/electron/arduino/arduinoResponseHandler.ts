import {ArduinoResponses} from "./arduinoCommands.js";

export class ArduinoResponseHandler {
    private onReadyCallback: (() => void) | null = null;
    private onAppliedAngleCallback: ((angle: number) => void) | null = null;

    setOnReadyCallback(callback: () => void) {
        this.onReadyCallback = callback;
    }

    setOnAppliedAngleCallback(callback: (angle: number) => void) {
        this.onAppliedAngleCallback = callback;
    }

    handle(response: any) {
        if (typeof response !== "string") return;
        switch (true) {
            case response === ArduinoResponses.READY:
                this.onReadyCallback?.();
                break;
            case this.isAppliedAngleResponse(response):
                this.onAppliedAngleCallback?.(this.extractAppliedAngle(response));
                break;
        }
    }

    private isAppliedAngleResponse(response: string): boolean {
        return response.substring(0, 2) === ArduinoResponses.APPLIED_ANGLE;
    }

    private extractAppliedAngle(response: string): number {
        try {
            return Number(response.substring(2));
        } catch (error) {
            return 90;
        }
    }
}

export const arduinoResponseHandler = new ArduinoResponseHandler();
