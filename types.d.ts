interface Window {
    application: {
        increaseOnce: () => Promise<void>
        decreaseOnce: () => Promise<void>
        increaseStop: () => Promise<void>
        increaseStart: () => Promise<void>
        decreaseStop: () => Promise<void>
        decreaseStart: () => Promise<void>
        moveToCenter: () => Promise<void>
        onAngleChanged: (callback: (angle: number) => void) => () => any
        connect: (ip: string, port: number) => Promise<boolean>
        disconnect: () => Promise<void>
        onDisconnected: (callback: () => void) => () => any
        setAngleOfServoCenterToNorth: (angle: number) => Promise<void>
        setIpAndPort: (ip: string, port: number) => Promise<void>
        setStep: (step: number) => Promise<void>
        getSavedState: () => Promise<{
            ip: string,
            port: number,
            step: number,
            angle: number,
            angleOfServoCenterToNorth: number
        }>,
        onError: (callback: () => void) => () => any
    };
}