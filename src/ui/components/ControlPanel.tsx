import {FaRegCircle, FaAnglesLeft, FaAnglesRight, FaAngleRight, FaAngleLeft} from "react-icons/fa6";
import {Button} from "antd";
import {applicationStore} from "../applicationStore.ts";

export default function ControlPanel() {
    const controlDisabled = !applicationStore.useConnected();

    return (
        <div className="flex gap-2 self-center">
            <Button
                disabled={controlDisabled}
                onClick={window.application.decreaseOnce}
                icon={<FaAngleLeft/>}
            />
            <Button
                disabled={controlDisabled}
                onMouseDown={event => event.button === 0 && window.application.decreaseStart()}
                onMouseUp={event => event.button === 0 && window.application.decreaseStop()}
                icon={<FaAnglesLeft/>}
            />
            <Button
                disabled={controlDisabled}
                onClick={event => event.button === 0 && window.application.moveToCenter()}
                icon={<FaRegCircle/>}
            />
            <Button
                disabled={controlDisabled}
                onMouseDown={event => event.button === 0 && window.application.increaseStart()}
                onMouseUp={event => event.button === 0 && window.application.increaseStop()}
                icon={<FaAnglesRight/>}
            />
            <Button
                disabled={controlDisabled}
                onClick={window.application.increaseOnce}
                icon={<FaAngleRight/>}
            />
        </div>
    );
}