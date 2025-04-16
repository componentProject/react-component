import React, { useState } from "react";
import { Meta } from "@storybook/react";
import IntlTable from "./IntlTable";
import { IntlProvider } from "react-intl";
import enUS from "../../locales/en-US";
import zhCN from "../../locales/zh-CN";

export default {
	title: "Components/IntlTable",
	component: IntlTable,
	parameters: {
		layout: "fullscreen",
	},
} as Meta;

const messagesMap = {
	"en-US": enUS,
	"zh-CN": zhCN,
};

export const Default = () => {
	const [locale, setLocale] = useState<"en-US" | "zh-CN">("en-US");

	return (
		<IntlProvider locale={locale} messages={messagesMap[locale]}>
			<div style={{ padding: "24px" }}>
				<IntlTable languages={["en-US", "zh-CN"]} />
			</div>
		</IntlProvider>
	);
};
