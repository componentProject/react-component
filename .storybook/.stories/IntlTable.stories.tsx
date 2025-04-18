/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-09 19:29:42
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-17 13:29:57
 * @FilePath: \react-component\.storybook\.stories\IntlTable.stories.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { Meta, StoryFn } from "@storybook/react";
import { Layout, Typography, Select } from "antd";
import IntlTable from "@/components/IntlTable";
import { IntlProvider, FormattedMessage } from "react-intl";
import zhCN from "@/locales/zh-CN";
import enUS from "@/locales/en-US";
import { LanguageProvider, useLanguage } from "@/locales/LanguageContext";

const meta: Meta<any> = {
	title: "",
	component: IntlTable,
	args: {},
	argTypes: {},
	// 为这个故事添加专门的装饰器
	decorators: [
		(Story) => (
			<LanguageProvider>
				<Story />
			</LanguageProvider>
		),
	],
};
export default meta;
const { Header, Content } = Layout;
const { Title } = Typography;

// 使用本地语言上下文
export const IntlTableWrapper: StoryFn = () => {
	// 使用本地语言上下文，替代全局语言上下文
	const { locale, setLocale } = useLanguage();
	console.log("IntlTableWrapper 渲染 - locale:", locale, typeof setLocale);

	const messages: Record<string, Record<string, string>> = {
		"zh-CN": zhCN,
		"en-US": enUS,
	};

	return (
		<IntlProvider locale={locale} messages={messages[locale]} key={locale}>
			<Layout className="app-container">
				<Header className="app-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Title level={3} style={{ color: "white", margin: 0 }}>
						<FormattedMessage id="intl.management.title" defaultMessage="国际化资源管理" />
					</Title>
					<Select
						value={locale}
						onChange={(value) => {
							console.log("切换语言到:", value);
							setLocale(value);
						}}
						style={{ width: 120 }}
						options={[
							{ value: "zh-CN", label: "中文" },
							{ value: "en-US", label: "English" },
						]}
					/>
				</Header>
				<Content className="app-content">
					<IntlTable />
				</Content>
			</Layout>
		</IntlProvider>
	);
};
IntlTableWrapper.args = {};
// export const IntlTableDemo: StoryFn = () => {
// 	return (
// 		<LanguageProvider>
// 			<IntlTableWrapper />
// 		</LanguageProvider>
// 	);
// };
// IntlTableDemo.args = {};
