declare global {
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
            getPorts: () => Promise<any[]>
            connectToPort: (path: string) => Promise<boolean>
            onPortDisconnected: (callback: () => void) => () => any
            getAngleOfServoCenterToNorth: () => Promise<number>
            setAngleOfServoCenterToNorth: (angle: number) => Promise<void>
        };
    }
}

export type PortData = {
    path: string,
    productId: string | undefined,
    vendorId: string | undefined,
    manufacturer: string | undefined,
    friendlyName: string | undefined
}

