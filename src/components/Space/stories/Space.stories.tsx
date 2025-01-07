import Space from "../index.tsx";
import "./Space.css";

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

const Template = (props) => {
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
