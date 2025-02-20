import Popover from "@/components/Popover";

const meta = {
	title: "Popover",
	component: null,
	args: {},
	argTypes: {
		children: {
			control: "disabled",
		},
	},
};
export default meta;

export const popover = () => {
	const popoverContent = (
		<div>
			三光前端
			<button
				onClick={() => {
					alert(1);
				}}
			>
				111
			</button>
		</div>
	);

	return (
		<Popover content={popoverContent} placement="bottom" trigger="click" style={{ margin: "200px" }}>
			<button>点我点我</button>
		</Popover>
	);
};
