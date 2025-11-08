import {PortData} from "../../../types";

async function getPorts(): Promise<PortData[]> {
    return await window.application.getPorts();
}

async function selectPort(path: string): Promise<boolean> {
    return await window.application.connectToPort(path);
}

function onPortDisconnected(callback: () => void) {
    return window.application.onPortDisconnected(callback);
}

export const portService = {
    getPorts,
    selectPort,
    onPortDisconnected
};