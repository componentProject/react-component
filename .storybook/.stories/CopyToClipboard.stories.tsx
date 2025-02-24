import CopyToClipboard from "@/components/CopyToClipboard";
import { propsType } from "@/components/CopyToClipboard/types";
import { Meta, StoryFn } from "@storybook/react";

const meta: Meta<propsType> = {
	title: "copyToClipboard",
	component: CopyToClipboard,
	args: {},
	argTypes: {
		children: {
			control: false,
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
