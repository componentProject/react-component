import { OnBoarding } from "@/components/OnBoarding";
import { Button, Flex } from "antd";

const meta = {
	title: "OnBoarding",
	component: null,
	parameters: {
		docs: {},
	},
	args: {},
	argTypes: {
		step: {
			type: "number",
			description:
				"当前步骤,selector是指定步骤所要包裹的html容器,placement是popover的位置,renderContent为popover的内容,beforeForward是下一步前的回调,beforeBack是上一步前的回调",
			control: "number",
		},
		steps: {
			type: `Array<{
									selector: () => HTMLElement | null;
									placement?: "top" | "right" | "bottom" | "left"| "start-top" | "start-right" | "start-bottom" | "start-left" | "end-top" | "end-right" | "end-bottom" | "end-left";
									renderContent?: (currentStep: number) => React.ReactNode;
									beforeForward?: (currentStep: number) => Promise<void> | void;
									beforeBack?: (currentStep: number) => Promise<void> | void;
			}>`,
			description: "步骤配置",
			control: false,
		},
		getContainer: {
			type: "() => HTMLElement",
			description: "容器",
			control: false,
		},
		onStepsEnd: {
			type: "() => Promise<void> | void",
			description: "所有步骤结束",
			control: false,
		},
	},
};

export default meta;

export const onBoarding = () => {
	return (
		<div className="App">
			<Flex gap="small" wrap="wrap" id="btn-group1">
				<Button type="primary">Primary Button</Button>
				<Button>Default Button</Button>
				<Button type="dashed">Dashed Button</Button>
				<Button type="text">Text Button</Button>
				<Button type="link">Link Button</Button>
			</Flex>

			<div style={{ height: "1000px" }}></div>

			<Flex wrap="wrap" gap="small">
				<Button type="primary" danger>
					Primary
				</Button>
				<Button danger>Default</Button>
				<Button type="dashed" danger id="btn-group2">
					Dashed
				</Button>
				<Button type="text" danger>
					Text
				</Button>
				<Button type="link" danger>
					Link
				</Button>
			</Flex>

			<div style={{ height: "500px" }}></div>

			<Flex wrap="wrap" gap="small">
				<Button type="primary" ghost>
					Primary
				</Button>
				<Button ghost>Default</Button>
				<Button type="dashed" ghost>
					Dashed
				</Button>
				<Button type="primary" danger ghost id="btn-group3">
					Danger
				</Button>
			</Flex>

			<OnBoarding
				steps={[
					{
						selector: () => {
							return document.getElementById("btn-group1");
						},
						renderContent: () => {
							return "第一步";
						},
						placement: "bottom",
					},
					{
						selector: () => {
							return document.getElementById("btn-group2");
						},
						renderContent: () => {
							return "第二步";
						},
						placement: "bottom",
					},
					{
						selector: () => {
							return document.getElementById("btn-group3");
						},
						renderContent: () => {
							return "第三步";
						},
						placement: "bottom",
					},
				]}
			/>
		</div>
	);
};
