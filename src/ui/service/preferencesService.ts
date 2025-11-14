async function saveAngleOfServoCenterToNorth(angle: number) {
    return await window.application.setAngleOfServoCenterToNorth(angle);
}

async function saveStep(step: number) {
    return await window.application.setStep(step);
}

async function saveIpAndPort(ip: string, port: number) {
    return await window.application.setIpAndPort(ip, port);
}

async function getSavedState() {
    return await window.application.getSavedState();
}

export const preferencesService = {
    saveAngleOfServoCenterToNorth,
    saveStep,
    saveIpAndPort,
    getSavedState
};