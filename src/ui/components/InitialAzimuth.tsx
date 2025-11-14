import {Button, InputNumber} from "antd";
import {useState} from "react";
import {RxUpdate} from "react-icons/rx";
import {MdDone} from "react-icons/md";
import {applicationAction, applicationStore} from "../applicationStore.ts";
import {preferencesService} from "../service/preferencesService.ts";

type InitialAzimuthProps = {
    className?: string
}

export default function InitialAzimuth(props: InitialAzimuthProps) {
    const angleOfServoCenterToNorth = applicationStore.angleOfServoCenterToNorth();
    const setAngleOfServoCenterToNorth = applicationAction.setAngleOfServoCenterToNorth();
    const [disabled, setDisabled] = useState(true);

    return (
        <div className={`flex gap-2 items-center ${props.className}`}>
            <p className="text-sm">Початковий азимут:</p>
            <InputNumber
                min={0}
                max={359}
                step={1}
                style={{width: "5em"}}
                changeOnWheel={true}
                onChange={async (value) => {
                    if (value !== null) {
                        setAngleOfServoCenterToNorth(value);
                    }
                }}
                value={angleOfServoCenterToNorth}
                disabled={disabled}
            />

            <Button
                icon={disabled ? <RxUpdate/> : <MdDone/>}
                type={disabled ? "default" : "primary"}
                onClick={async () => {
                    await preferencesService.saveAngleOfServoCenterToNorth(angleOfServoCenterToNorth);
                    setDisabled(!disabled);
                }}
            />
        </div>
    );
}