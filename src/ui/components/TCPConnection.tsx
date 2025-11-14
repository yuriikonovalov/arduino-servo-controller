import {Button, Input} from "antd";
import {connectionHooks} from "../hooks/connectionHooks.ts";
import {applicationAction, applicationStore} from "../applicationStore.ts";

type TCPConnectionProps = {
    className?: string
}

export default function TCPConnection(props: TCPConnectionProps) {
    const connecting = applicationStore.useConnecting();
    const ip = applicationStore.useIp();
    const port = applicationStore.usePort();
    const setIp = applicationAction.useSetIp();
    const setPort = applicationAction.useSetPort();
    const connect = connectionHooks.useConnect();
    const disconnect = connectionHooks.useDisconnect();
    const connected = applicationStore.useConnected();

    return (
        <div className={`w-full flex items-baseline justify-between gap-2 ${props.className}`}>
            <div className="flex items-baseline gap-2">
                <label htmlFor="ip_input">IP:</label>
                <Input
                    id="ip_input"
                    style={{width: "10em"}}
                    value={ip}
                    onChange={e => setIp(e.target.value)}
                />
                <label htmlFor="port_input">Порт:</label>
                <Input
                    id="port_input"
                    style={{width: "5em"}}
                    value={port}
                    onChange={e => setPort(e.target.value)}
                />
            </div>
            {
                connecting || !connected
                    ? <Button
                        type="primary"
                        onClick={connect}
                        disabled={connecting}
                        loading={connecting}
                    >
                        {connecting ? "Підключення" : "Підключити"}
                    </Button>
                    : <Button onClick={disconnect} disabled={connecting}>Відключити</Button>


            }

        </div>
    );
}