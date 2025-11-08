import {useEffect} from "react";
import {angleService} from "../service/angleService.ts";
import {applicationAction} from "../applicationStore.ts";
import {portService} from "../service/portService.ts";
import {App} from "antd";

function useListenToAngleChanges() {
    const setAngle = applicationAction.useSetAngle();
    useEffect(() => {
        const unsubscribe = angleService.onAngleChanged((angle) => {
            setAngle(angle);
        });
        return unsubscribe;
    }, [setAngle]);
}

function useListenToPortDisconnected() {
    const {message} = App.useApp();
    const selectPort = applicationAction.useSelectPort();
    useEffect(() => {
        const unsubscribe = portService.onPortDisconnected(() => {
            selectPort(null);
            message.error("Порт відключено");
        });
        return unsubscribe;
    }, [selectPort]);
}

export const applicationHooks = {
    useListenToAngleChanges,
    useListenToPortDisconnected
};