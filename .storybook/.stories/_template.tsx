// import {propsType} from '@/components/Upload'
import { Meta, StoryFn } from "@storybook/react";
const meta: Meta<any> = {
	title: "",
	component: undefined,
	args: {},
	argTypes: {},
};
export default meta;
export const upload: StoryFn = (props: any) => <div>{props}</div>;
const props = {};
upload.args = props;
