import {applicationAction, applicationStore} from "../applicationStore.ts";
import {Radio} from "antd";
import {preferencesService} from "../service/preferencesService.ts";

type StepSelectorProps = {
    className?: string
}
export default function StepSelector(props: StepSelectorProps) {
    const options = applicationStore.useStepOptions();
    const selectedStep = applicationStore.useStep();
    const selectStep = applicationAction.useSetStep();
    const onClick = async (step: number) => {
        selectStep(step);
        await preferencesService.saveStep(step);
    };

    return (
        <div className={`flex items-baseline ${props.className}`}>
            <span className="me-2">Крок повороту:</span>
            {options.map(step => (
                <Radio
                    key={step}
                    checked={step === selectedStep}
                    onClick={() => onClick(step)}
                >
                    {step}°
                </Radio>
            ))}
        </div>
    );
}