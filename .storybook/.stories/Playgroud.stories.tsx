import { Playground, PlaygroundProvider } from "@/components/Playground";
import { Meta, StoryFn } from "@storybook/react";
const meta: Meta<any> = {
	title: "Playground",
	component: Playground,
	args: {},
	argTypes: {},
};
export default meta;
export const PlaygroundDemo: StoryFn = (props: any) => {
	return (
		<PlaygroundProvider>
			<Playground {...props} />
		</PlaygroundProvider>
	);
};
const props = {};
PlaygroundDemo.args = props;
