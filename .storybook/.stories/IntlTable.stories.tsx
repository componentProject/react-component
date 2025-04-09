/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-09 19:29:42
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 20:21:27
 * @FilePath: \react-component\.storybook\.stories\IntlTable.stories.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { Meta, StoryFn } from "@storybook/react";
import { Layout, Typography } from "antd";
import IntlTable from "@/components/IntlTable";

const meta: Meta<any> = {
	title: "",
	component: IntlTable,
	args: {},
	argTypes: {},
};
export default meta;
const { Header, Content } = Layout;
const { Title } = Typography;

export const IntlTableDemo: StoryFn = () => {
	return (
		<Layout className="app-container">
			<Header className="app-header">
				<Title level={3} style={{ color: "white", margin: 0 }}>
					国际化资源管理
				</Title>
			</Header>
			<Content className="app-content">
				<IntlTable />
			</Content>
		</Layout>
	);
};
IntlTableDemo.args = {};
