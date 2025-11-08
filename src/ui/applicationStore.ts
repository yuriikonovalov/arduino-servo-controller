import {create} from "zustand";
import {PortData} from "../../types";

type ApplicationState = {
    ports: PortData[],
    selectedPort: string | null,
    initialPositionAngle: number,
    angle: number
}

type ApplicationAction = {
    setPorts: (ports: PortData[]) => void,
    selectPort: (path: string | null) => void,
    setInitialPositionAngle: (angle: number) => void,
    setAngle: (angle: number) => void
}

type ApplicationStore = ApplicationState & ApplicationAction

const useStore = create<ApplicationStore>((set) => ({
    ports: [],
    selectedPort: null,
    initialPositionAngle: 0,
    // Considering that the servo initially is set to 90 degrees which is the middle.
    angle: 90,

    setPorts: (ports: PortData[]) => set({ports: ports}),
    selectPort: (path: string | null) => set({selectedPort: path}),
    setInitialPositionAngle: (angle: number) => set({initialPositionAngle: angle}),
    setAngle: (angle: number) => set({angle: angle}),
}));

const usePorts = () => useStore(store => store.ports);
const useSelectedPort = () => useStore(store => store.selectedPort);
const useInitialPositionAngle = () => useStore(store => store.initialPositionAngle);
const getAngleForRendering = () => useStore.getState().angle;
const useAngleForDisplaying = () => useStore(store => {
    // Considering servo's 90 degrees angle as the middle.
    // User will see it as 0 degree. The servo can go from -90 to 90 degrees.
    let normalizedAngle = 90 - store.angle;
    // Avoid negative values.
    if (normalizedAngle < 0) {
        normalizedAngle = 360 + normalizedAngle;
    }
    return normalizedAngle;
});
const useIsControlDisabled = () => useStore(store => store.selectedPort === null);

const useSetPorts = () => useStore(store => store.setPorts);
const useSelectPort = () => useStore(store => store.selectPort);
const useSetInitialPositionAngle = () => useStore(store => store.setInitialPositionAngle);
const useSetAngle = () => useStore(store => store.setAngle);

export const applicationStore = {
    usePorts,
    useSelectedPort,
    useInitialPositionAngle,
    useAngleForDisplaying,
    getAngleForRendering,
    useIsControlDisabled
};

export const applicationAction = {
    useSetPorts,
    useSelectPort,
    useSetInitialPositionAngle,
    useSetAngle
};