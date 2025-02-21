import Popover from "@/components/Popover";
import type { PopoverProps } from "@/components/Popover";

const meta = {
	title: "Popover",
	component: null,
	args: {
		placement: "bottom",
		trigger: "click",
	},
	argTypes: {
		content: {
			control: "text",
			type: '"ReactNode"|"string"',
			description: "popover 的内容",
		},
		trigger: {
			options: ["hover", "click"],
			control: "select",
			type: '"hover" | "click"',
			description: "触发popover的方式",
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
			description: "popover 的位置",
		},
		open: {
			control: "boolean",
			type: "boolean",
			description: "是否打开popover",
		},
		onOpenChange: {
			control: "function",
			type: "(open: boolean) => void",
			description: "popover 打开或关闭时的回调函数",
		},
		className: {
			control: "text",
			type: "string",
			description: "popover 的 className",
		},
		style: {
			control: "object",
			type: "CSSProperties",
			description: "popover 的样式",
		},
		children: {
			control: "disabled",
			type: "ReactNode",
			description: "popover 的子元素",
		},
	},
};
export default meta;

export const popover = (args: PopoverProps) => {
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
