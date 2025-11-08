import {memo} from "react";
import Compass from "./Compass.tsx";
import {applicationStore} from "../applicationStore.ts";

export default memo(CompassWrapper);

function CompassWrapper() {
    return <Compass getAngle={applicationStore.getAngleForRendering}/>;
}