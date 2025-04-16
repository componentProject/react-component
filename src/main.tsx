import "@/locales";

import "@/assets/styles/main.css";
import App from "./App.tsx";
// react 18 创建（会导致 antd 菜单折叠时闪烁，等待官方修复）
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

// import {PersistGate} from "redux-persist/integration/react";
// import {Provider} from "react-redux";
// import {store, persistor} from "@/redux";
import { defineMessages, IntlProvider } from "react-intl";
import { messages } from "@/locales";

const messsages = defineMessages(messages);
const locale = localStorage.getItem("locale") || "zh-CN";
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<IntlProvider messages={messsages[locale]} locale={locale}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</IntlProvider>
	</StrictMode>,
);

// import ReactDOM from "react-dom";
//
// // react 17 创建，控制台会报错，暂时不影响使用（菜单折叠时不会出现闪烁）
// ReactDOM.render(
//     // * react严格模式
//     // <React.StrictMode>
//     <Provider store={store}>
//         <PersistGate persistor={persistor}>
//             <App/>
//         </PersistGate>
//     </Provider>,
//     // </React.StrictMode>,
//     document.getElementById("root")
// );
