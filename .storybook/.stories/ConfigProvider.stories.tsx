import ConfigProvider from "@/components/ConfigProvider";
import { StoryFn } from "@storybook/react";

import Calendar from "@/components/Calendar";
import Space from "@/components/Space";
import "./assets/styles/Space.css";

/**
 * 全局配置组件
 */
const meta = {
	title: "ConfigProvider",
	component: ConfigProvider,
	args: {},
	argTypes: {
		children: {
			control: false,
		},
	},
	tags: ["autodocs"],
};
export default meta;

const Template: StoryFn = ({ children, ...props }) => {
	return <ConfigProvider {...props}>{children}</ConfigProvider>;
};

export const space = Template.bind({});
space.args = {
	children: (
		<Space>
			<div className="box"></div>
			<div className="box"></div>
			<div className="box"></div>
		</Space>
	),
};
const spaceArgTypes: any = {
	space: {
		control: "radio",
		type: "'small' | 'middle' | 'large' | number | undefined",
		options: ["small", "middle", "large", 32],
		description: "space组件的间距",
	},
};
space.argTypes = spaceArgTypes;
export const calendar = Template.bind({});
calendar.args = {
	locale: "en-US",
	children: <Calendar />,
};
const calendarArgTypes: any = {
	locale: {
		control: "radio",
		type: "'zh-CN' | 'en-US'",
		options: ["zh-CN", "en-US"],
		description: "语言",
	},
};
calendar.argTypes = calendarArgTypes;
