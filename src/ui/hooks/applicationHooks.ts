import {useEffect} from "react";
import {applicationAction} from "../applicationStore.ts";
import {applicationService} from "../service/applicationService.ts";
import {preferencesService} from "../service/preferencesService.ts";
import {App} from "antd";

function useListenToAngleChanges() {
    const setAngle = applicationAction.useSetAngle();
    useEffect(() => {
        const unsubscribe = applicationService.onAngleChanged((angle) => {
            setAngle(angle);
        });
        return unsubscribe;
    }, [setAngle]);
}

function useListenToError() {
    const {message} = App.useApp();
    useEffect(() => {
        const unsubscribe = applicationService.onError(() => {
            message.error("Сталася помилка");
        });
        return unsubscribe;
    }, []);
}

function useSavedState() {
    const setState = applicationAction.useSetSavedState();
    const getState = async () => {
        const state = await preferencesService.getSavedState();
        setState(state.ip, state.port, state.step, state.angle - state.angleOfServoCenterToNorth, state.angleOfServoCenterToNorth);
    };
    useEffect(() => {
        getState();
    }, []);
}


export const applicationHooks = {
    useListenToAngleChanges,
    useSavedState,
    useListenToError
};