// import {fn} from '@storybook/test';

import Calendar from "@/components/Calendar";
import type { propsType } from "@/components/Calendar/types";
import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<propsType> = {
	title: "日历",
	component: Calendar,
	parameters: {
		docs: {},
	},
	args: {},
	argTypes: {
		locale: {
			control: "radio",
			options: ["zh-CN", "en-US"],
		},
	},
};

export default meta;

const Template: StoryFn = (props) => {
	return <Calendar {...props} />;
};
export const calendar = Template.bind({});
calendar.args = {};
