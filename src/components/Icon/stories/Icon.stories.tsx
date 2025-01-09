// import {fn} from '@storybook/test';

import Icon from "../index.tsx";
import { StoryFn } from "@storybook/react";

const meta = {
	title: "Icon",
	component: Icon,
	args: {},
	argTypes: {
		color: { control: "color" },
		size: { control: "text" },
		spin: { control: "boolean" },
		style: { control: "object" },
		scriptUrl: { control: "text" },
		type: { control: "text" },
		className: { control: "text" },
		children: { control: "disabled" },
	},
};

export default meta;

const Template: StoryFn = (props) => {
	return <Icon {...props} />;
};

export const iconfont = Template.bind({});
iconfont.args = {
	type: "icon-zhangshangcaifuyemianshoujiban345",
	scriptUrl: "//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js",
};

export const icon: StoryFn = (props) => {
	return (
		<Icon {...props}>
			<svg
				d="1651119499039"
				className="icon"
				viewBox="0 0 1024 1024"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				p-id="9021"
			>
				<path d="M512 720m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="9022"></path>
				<path d="M480 416v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8z" p-id="9023"></path>
				<path
					d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48z m-783.5-27.9L512 239.9l339.8 588.2H172.2z"
					p-id="9024"
				></path>
			</svg>
		</Icon>
	);
};
