import RadarWrapperComponent from "./components/CompassWrapper.tsx";
import AnglePanel from "./components/AnglePanel.tsx";
import PortSelector from "./components/PortSelector.tsx";
import InitialPosition from "./components/InitialPosition.tsx";
import {Divider} from "antd";
import {applicationHooks} from "./hooks/applicationHooks.ts";
import ControlPanel from "./components/ControlPanel.tsx";

function Application() {
    applicationHooks.useListenToAngleChanges();
    applicationHooks.useListenToPortDisconnected();

    return (
        <div className="">
            <div className="flex gap-10 p-2">
                <PortSelector/>
                <InitialPosition/>
            </div>
            <Divider style={{margin: "0"}}/>
            <div className="mt-5 flex flex-col gap-10 justify-self-center">
                <RadarWrapperComponent/>
                <AnglePanel className="text-center"/>
                <ControlPanel/>
            </div>

        </div>
    );
}

export default Application;
