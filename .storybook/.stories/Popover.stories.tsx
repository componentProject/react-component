import Popover from "@/components/Popover";

const meta = {
	title: "Popover",
	component: null,
	args: {
		placement: "bottom",
		trigger: "click",
	},
	// content: ReactNode;
	// 	trigger?: "hover" | "click";
	// 	placement?: Side | AlignedPlacement;
	// 	open?: boolean;
	// 	onOpenChange?: (open: boolean) => void;
	// 	className?: string;
	// 	style?: CSSProperties;
	argTypes: {
		content: {
			control: "text",
			type: '"ReactNode"|"string"',
		},
		trigger: {
			options: ["hover", "click"],
			control: "select",
			type: '"hover" | "click"',
		},
		placement: {
			options: [
				"top",
				"bottom",
				"left",
				"right",
				"top-start",
				"top-end",
				"bottom-start",
				"bottom-end",
				"left-start",
				"left-end",
				"right-start",
				"right-end",
			],
			control: "select",
			type: '"top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end"',
		},
		open: {
			control: "boolean",
			type: "boolean",
		},
		onOpenChange: {
			control: "function",
			type: "(open: boolean) => void",
		},
		className: {
			control: "text",
			type: "string",
		},
		style: {
			control: "object",
			type: "CSSProperties",
		},
		children: {
			control: "disabled",
			type: "ReactNode",
		},
	},
};
export default meta;

export const popover = (args) => {
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
		<Popover content={popoverContent} {...args} style={{ margin: "200px" }}>
			<button>点我点我</button>
		</Popover>
	);
};
