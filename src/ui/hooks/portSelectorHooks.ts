import {applicationAction} from "../applicationStore.ts";
import {portService} from "../service/portService.ts";
import {useState} from "react";

function usePorts() {
    const [gettingPorts, setGettingPorts] = useState<boolean>(false);
    const setPorts = applicationAction.useSetPorts();

    const getPorts = async () => {
        setGettingPorts(true);
        const ports = await portService.getPorts();
        setPorts(ports);
        setGettingPorts(false);
    };

    return {getPorts, gettingPorts};
}

export const portSelectorHooks = {
    usePorts
};