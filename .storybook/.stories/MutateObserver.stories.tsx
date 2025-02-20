import MutateObserver from "@/components/MutateObserver";
import { useState, useEffect } from "react";
import { StoryFn } from "@storybook/react";

const meta = {
	title: "MutateObserver",
	component: MutateObserver,
	args: {},
	argTypes: {
		options: {
			control: "object",
			type: {
				subtree: "boolean",
				childList: "boolean",
				attributeFilter: "string[]",
			},
			description: "MutationObserverInit",
		},
		onMutate: {
			control: "function",
			type: "((mutations: MutationRecord[], observer: MutationObserver) => void)",
			description: "(mutations: MutationRecord[], observer: MutationObserver) => void",
		},
		children: {
			control: "disabled",
			type: "ReactElement",
			description: "ReactElement",
		},
	},
};

export default meta;

const Template: StoryFn = (props) => {
	const [className, setClassName] = useState("aaa");

	useEffect(() => {
		setTimeout(() => setClassName("bbb"), 2000);
	}, []);
	return (
		<>
			<MutateObserver {...props}>
				<div id="container" style={{ width: "100px", height: "100px", background: "red" }}>
					<div className={className}>
						{className === "aaa" ? (
							<div>aaa</div>
						) : (
							<div>
								<p>bbb</p>
							</div>
						)}
					</div>
				</div>
			</MutateObserver>
		</>
	);
};
export const portal = Template.bind({});
portal.args = {
	onMutate: (mutationsList: MutationRecord[]) => {
		console.log(mutationsList);
	},
};
