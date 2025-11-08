import {applicationAction} from "../applicationStore.ts";
import {useEffect} from "react";
import {angleService} from "../service/angleService.ts";

function useInitialPosition() {
    const setInitialPositionAngle = applicationAction.useSetInitialPositionAngle();
    const getAngle = async () => {
        const angle = await angleService.getInitialPositionAngle();
        setInitialPositionAngle(angle);
    };
    useEffect(() => {
        getAngle();
    }, []);
}

export const initialPositionHooks = {
    useInitialPosition
};