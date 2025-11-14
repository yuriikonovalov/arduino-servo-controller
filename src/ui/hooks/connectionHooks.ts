import {applicationAction, applicationStore} from "../applicationStore.ts";
import {applicationService} from "../service/applicationService.ts";
import {App} from "antd";
import {preferencesService} from "../service/preferencesService.ts";
import {useEffect} from "react";

function useConnect() {
    const {message} = App.useApp();
    const setConnected = applicationAction.useSetConnected();
    const setConnecting = applicationAction.useSetConnecting();
    return async () => {
        try {
            const {ip, port} = applicationStore.getIpAndPort();
            if (ip.trim() === "" || port.trim() === "") {
                message.error("Не вдалося підключитися. Перевірте IP адресу та порт.");
                return;
            }

            setConnecting(true);
            await preferencesService.saveIpAndPort(ip, Number(port));
            const connected = await applicationService.connect(ip, Number(port));
            setConnected(connected);
            if (connected) {
                message.success("Підключено");
            } else {
                message.error("Не вдалося підключитися");
            }
        } catch (error: any) {
            setConnected(false);
            message.error("Сталася помилка під час підключення: " + error.message);
        } finally {
            setConnecting(false);
        }
    };
}

function useDisconnect() {
    return applicationService.disconnect;
}

function useListenToDisconnected() {
    const {message} = App.useApp();
    const setConnected = applicationAction.useSetConnected();
    useEffect(() => {
        const unsubscribe = applicationService.onDisconnected(() => {
            message.error("Відключено");
            setConnected(false);
        });
        return unsubscribe;
    }, [setConnected]);
}

export const connectionHooks = {
    useConnect,
    useDisconnect,
    useListenToDisconnected
};