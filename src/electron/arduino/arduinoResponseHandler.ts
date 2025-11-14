import {ArduinoResponses} from "./arduinoCommands.js";

export class ArduinoResponseHandler {
    private onAppliedAngleCallback: ((angle: number) => void) | null = null;

    setOnAppliedAngleCallback(callback: (angle: number) => void) {
        this.onAppliedAngleCallback = callback;
    }

    handle(response: any) {
        try {
            const data = response.toString().trim();
            console.log(data);
            if (this.isAppliedAngleResponse(data)) {
                this.onAppliedAngleCallback?.(this.extractAppliedAngle(data));
            }
        } catch (error) {
            return;
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
