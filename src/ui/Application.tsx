import RadarWrapperComponent from "./components/CompassWrapper.tsx";
import AnglePanel from "./components/AnglePanel.tsx";
import InitialAzimuth from "./components/InitialAzimuth.tsx";
import {Divider} from "antd";
import {applicationHooks} from "./hooks/applicationHooks.ts";
import ControlPanel from "./components/ControlPanel.tsx";
import TCPConnection from "./components/TCPConnection.tsx";
import StepSelector from "./components/StepSelector.tsx";
import {connectionHooks} from "./hooks/connectionHooks.ts";

function Application() {
    applicationHooks.useListenToError();
    applicationHooks.useListenToAngleChanges();
    applicationHooks.useSavedState();
    connectionHooks.useListenToDisconnected();

    return (
        <div>
            <TCPConnection className="p-2"/>
            <Divider style={{margin: "0"}}/>
            <div className="mt-5 mb-4 flex flex-col gap-10 justify-self-center">
                <RadarWrapperComponent/>
                <AnglePanel className="text-center"/>
                <ControlPanel/>
            </div>
            <Divider style={{margin: "0"}}/>
            <div className="flex p-2 items-baseline">
                <InitialAzimuth className="w-full"/>
                <StepSelector className="w-full"/>
            </div>
        </div>
    );
}

export default Application;
