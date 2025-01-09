import CopyToClipboard from "../index.tsx";
import { StoryFn } from "@storybook/react";

const meta = {
	title: "copyToClipboard",
	component: CopyToClipboard,
	args: {},
	argTypes: {
		children: {
			control: "disabled",
		},
	},
};

export default meta;

const Template: StoryFn = (props) => {
	return (
		<>
			<CopyToClipboard {...props}>
				<div>复制</div>
			</CopyToClipboard>
		</>
	);
};
export const copy = Template.bind({});
copy.args = {
	text: "hello world",
	debug: true,
	message: "复制成功",
};
