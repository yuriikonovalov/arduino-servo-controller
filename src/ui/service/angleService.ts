async function getInitialPositionAngle() {
    return await window.application.getAngleOfServoCenterToNorth();
}

async function setInitialPositionAngle(angle: number) {
    return await window.application.setAngleOfServoCenterToNorth(angle);
}

function onAngleChanged(callback: (angle: number) => void): () => any {
    return window.application.onAngleChanged(callback);
}

export const angleService = {
    getInitialPositionAngle,
    setInitialPositionAngle,
    onAngleChanged
};