import Portal from "@/components/Portal";

const meta = {
	title: "Portal",
	component: Portal,
	args: {},
	argTypes: {
		attach: {
			control: "radio",
			options: [".box1", ".box2"],
			type: "HTMLElement | string",
			description: "要挂载的容器",
		},
		children: {
			control: false,
			type: "ReactNode",
			description: "要渲染的子元素",
		},
	},
};

export default meta;

export const portal = (props) => {
	return (
		<>
			<div style={{ width: "200px", height: "200px", border: "1px solid" }}>
				<div className={"box1"}>容器1</div>
				<div className={"box2"}>容器2</div>
			</div>
			<Portal {...props}>
				<div style={{ width: "100px", height: "100px", background: "red" }}></div>
			</Portal>
		</>
	);
};
portal.args = {
	attach: ".box1",
};
