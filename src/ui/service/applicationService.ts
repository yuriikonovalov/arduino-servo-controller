async function connect(ip: string, port: number) {
    return await window.application.connect(ip, port);
}

function onDisconnected(callback: () => void) {
    return window.application.onDisconnected(callback);
}

function onAngleChanged(callback: (angle: number) => void): () => any {
    return window.application.onAngleChanged(callback);
}

function disconnect() {
    return window.application.disconnect();
}

function onError(callback: () => void): () => any {
    return window.application.onError(callback);
}

export const applicationService = {
    connect,
    disconnect,
    onDisconnected,
    onAngleChanged,
    onError
};