import ConfigProvider from "@/components/ConfigProvider";
import Calendar from "@/components/Calendar";
import Space from "@/components/Space";
import "./assets/styles/Space.css";
import { StoryFn } from "@storybook/react";

/**
 * 全局配置组件
 */
const meta = {
	title: "ConfigProvider",
	component: ConfigProvider,
	args: {},
	tags: ["autodocs"],
};
export default meta;

const Template: StoryFn = ({ children, ...props }) => {
	return <ConfigProvider {...props}>{children}</ConfigProvider>;
};

export const space = Template.bind({});
space.argTypes = {
	space: { control: "radio", options: ["small", "middle", "large", 32] },
};
space.args = {
	children: (
		<Space>
			<div className="box"></div>
			<div className="box"></div>
			<div className="box"></div>
		</Space>
	),
};
export const calendar = Template.bind({});
calendar.argTypes = {
	locale: { control: "radio", options: ["zh-CN", "en-US"] },
};
calendar.args = {
	children: <Calendar />,
};
