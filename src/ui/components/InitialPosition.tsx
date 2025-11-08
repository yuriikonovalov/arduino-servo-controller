import {Button, InputNumber} from "antd";
import {useState} from "react";
import {RxUpdate} from "react-icons/rx";
import {MdDone} from "react-icons/md";
import {initialPositionHooks} from "../hooks/initialPositionHooks.ts";
import {applicationAction, applicationStore} from "../applicationStore.ts";
import {angleService} from "../service/angleService.ts";

export default function InitialPosition() {
    initialPositionHooks.useInitialPosition();
    const initialPositionAngle = applicationStore.useInitialPositionAngle();
    const setInitialPositionAngle = applicationAction.useSetInitialPositionAngle();

    const [disabled, setDisabled] = useState(true);

    return (
        <div className="w-full flex gap-2 items-center">
            <p className="text-sm">Кут напрямку:</p>
            <InputNumber
                min={0}
                max={359}
                step={1}
                changeOnWheel={true}
                onChange={async (value) => {
                    if (value !== null) {
                        setInitialPositionAngle(value);
                    }
                }}
                value={initialPositionAngle}
                disabled={disabled}
            />

            <Button
                icon={disabled ? <RxUpdate/> : <MdDone/>}
                type={disabled ? "default" : "primary"}
                onClick={async () => {
                    await angleService.setInitialPositionAngle(initialPositionAngle);
                    setDisabled(!disabled);
                }}
            />
        </div>
    );
}