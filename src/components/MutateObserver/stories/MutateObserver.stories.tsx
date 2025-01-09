import MutateObserver from "../index.tsx";
import { useState, useEffect } from "react";
import { StoryFn } from "@storybook/react";

const meta = {
	title: "MutateObserver",
	component: MutateObserver,
	args: {},
	argTypes: {
		children: {
			control: "disabled",
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
