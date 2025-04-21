import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import LowCodeEditor from "@/components/LowCodeEditor";
import { Meta, StoryFn } from "@storybook/react";

const meta: Meta<any> = {
	title: "",
	component: undefined,
	args: {},
	argTypes: {},
	decorators: [
		(Story) => (
			<DndProvider backend={HTML5Backend}>
				<Story />
			</DndProvider>
		),
	],
};
export default meta;
export const LowCodeEditorDemo: StoryFn = (props: any) => {
	return <LowCodeEditor {...props} />;
};
const props = {};
LowCodeEditorDemo.args = props;
