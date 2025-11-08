import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import Application from './Application.tsx';
import dayjs from "dayjs";
import "dayjs/locale/uk.js";
import locale from "antd/locale/uk_UA";
import {App, ConfigProvider} from "antd";
import '@ant-design/v5-patch-for-react-19';

dayjs.locale("uk");

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider locale={locale}>
            <App>
                <Application/>
            </App>
        </ConfigProvider>
    </StrictMode>
);
