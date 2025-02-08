import Space from "@/components/Space";
import "./assets/styles/Space.css";
import type { StoryFn } from "@storybook/react";

/**
 * flex布局组件
 */
const meta = {
	title: "Space",
	component: Space,
	args: {},
	argTypes: {
		split: { control: "dom" },
		size: { control: "radio", options: ["small", "middle", "large", 32] },
	},
};
export default meta;

const Template: StoryFn = (props) => {
	return (
		<Space {...props}>
			<div className="box"></div>
			<div className="box"></div>
			<div className="box"></div>
		</Space>
	);
};

export const horizontal = Template.bind({});
horizontal.args = {
	direction: "horizontal",
};
export const vertical = Template.bind({});
vertical.args = {
	direction: "vertical",
};
