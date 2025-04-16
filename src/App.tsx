/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-03-10 16:34:04
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-16 18:24:41
 * @FilePath: \react-component\src\App.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import "./App.css";
import { useRoutes } from "react-router";
import { Suspense } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import zhCN from "./locales/zh-CN";
import enUS from "./locales/en-US";
import { LanguageProvider, useLanguage } from "./locales/LanguageContext";

import routes from "./router";

// 语言消息
const messages = {
	"zh-CN": zhCN,
	"en-US": enUS,
};

// 主应用包装器
function AppWrapper() {
	return (
		<LanguageProvider>
			<AppContent />
		</LanguageProvider>
	);
}

// 实际应用内容
function AppContent() {
	const { locale, setLocale } = useLanguage();

	const lnguages = {
		en: { nativeName: "English" },
		zh: { nativeName: "中文" },
	};

	return (
		<IntlProvider locale={locale} messages={messages[locale as keyof typeof messages]}>
			<h1>
				<FormattedMessage id="language" defaultMessage="语言" />
			</h1>
			<header>
				<select onChange={(e) => setLocale(e.target.value === "en" ? "en-US" : "zh-CN")}>
					{Object.keys(lnguages).map((lng) => (
						<option
							key={lng}
							value={lng}
							label={lnguages[lng as keyof typeof lnguages].nativeName}
							style={{ fontWeight: locale.startsWith(lng) ? "bold" : "normal" }}
						/>
					))}
				</select>
			</header>
			<Suspense fallback={<h1>你好,我在加载中....</h1>}>{useRoutes(routes)}</Suspense>
		</IntlProvider>
	);
}

export default AppWrapper;
