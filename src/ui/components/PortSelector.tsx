import {App, Select} from "antd";
import {applicationAction, applicationStore} from "../applicationStore.ts";
import {portSelectorHooks} from "../hooks/portSelectorHooks.ts";
import {portService} from "../service/portService.ts";

export default function PortSelector() {
    const {message} = App.useApp();
    const ports = applicationStore.usePorts();
    const selectedPort = applicationStore.useSelectedPort();
    const selectPort = applicationAction.useSelectPort();
    const {getPorts, gettingPorts} = portSelectorHooks.usePorts();

    const onSelectPort = async (path: string) => {
        const connected = await portService.selectPort(path);
        if (connected) {
            selectPort(path);
        } else {
            selectPort(null);
            message.error("Не вдалося підлючитися");
        }
    };

    return (
        <div className="w-full flex gap-2 items-center">
            <p className="text-sm">Порт:</p>
            <Select
                className="w-full text-left"
                placeholder="Обрати порт"
                value={selectedPort}
                options={ports.map(port => ({
                    value: port.path,
                    label: port.friendlyName || "",
                }))}
                loading={gettingPorts}
                onChange={onSelectPort}
                notFoundContent="Відсутні порти для підключення"
                onOpenChange={open => open && getPorts()}
                optionRender={a => (
                    <p>{a.value} <span className="text-gray-600 text-xs">{a.label}</span></p>
                )}
            />

        </div>
    );
}