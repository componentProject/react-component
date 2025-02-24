import { createFromIconfont } from "@/components/IconFont";
import { StoryFn } from "@storybook/react";

/**
 * iconfont组件,需要先通过createFromIconfont函数创建,
 * 例如const IconFont = createFromIconfont('//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js')
 * */

const meta = {
	title: "IconFont",
	args: {
		color: "#333",
		size: "1em",
		spin: false,
		style: {},
		className: "",
	},
	parameters: {},
	argTypes: {
		color: {
			control: "color",
			type: "string",
			description: "Icon color",
		},
		size: {
			control: "text",
			type: "string | string[]",
			description: "Icon size",
		},
		spin: {
			control: "boolean",
			type: "boolean",
			description: "Whether to rotate the icon",
		},
		style: {
			control: "object",
			type: "React.CSSProperties",
			description: "Icon custom style",
		},
		scriptUrl: {
			control: "text",
			type: "string",
			description: "Iconfont script URL",
		},
		type: {
			control: "text",
			type: "string",
			description: "Icon type",
		},
		className: {
			control: "text",
			type: "string",
			description: "Icon custom class",
		},
		children: {
			control: false,
			type: "React.ReactNode",
		},
	},
};
export default meta;

const Template: StoryFn = (args) => {
	const { scriptUrl, ...props } = args;
	const IconFont = createFromIconfont(scriptUrl);
	return <IconFont {...props} />;
};

export const Defalut = Template.bind({});

Defalut.args = {
	scriptUrl: "//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js",
	type: "icon-zhangshangcaifuyemianshoujiban345",
};
