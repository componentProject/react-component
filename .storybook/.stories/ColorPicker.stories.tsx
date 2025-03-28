import { useState } from "react";
import type { ChangeEventHandler } from "react";
import { ColorPickerPanel, Color } from "@/components/ColorPicker";

const meta = {
	title: "ColorPicker",
	component: null,
	parameters: {
		docs: {},
	},
	args: {},
	argTypes: {
		className: {
			control: "text",
			type: "string",
			description: "ColorPicker 的 className",
		},
		style: {
			control: "object",
			type: "CSSProperties",
			description: "ColorPicker 的 style",
		},
		value: {
			control: false,
			type: "string | number | RGB | RGBA | HSL | HSLA | Color",
			description: "当前颜色",
		},
		onChange: {
			control: false,
			type: "(color: Color) => void",
			description: "颜色变化时的回调",
		},
	},
};

export default meta;

export const ColorPickerDemo = () => {
	const [color, setColor] = useState<Color>(new Color("rgb(166,57,255)"));

	const handleHueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const hsv = color.toHsv();
		const val = +e.target.value;

		setColor(
			new Color({
				h: val,
				s: hsv.s,
				v: hsv.v,
			}),
		);
	};

	const handleVChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const hsv = color.toHsv();
		const val = +e.target.value;

		setColor(
			new Color({
				h: hsv.h,
				s: hsv.s,
				v: val,
			}),
		);
	};

	return (
		<div style={{ width: "300px" }}>
			<ColorPickerPanel value={color} onChange={(newColor) => setColor(newColor)}></ColorPickerPanel>
			<div>
				色相：
				<input type="range" min={0} max={360} step={0.1} value={color.toHsv().h} onChange={handleHueChange} />
			</div>
			<div>
				明度：
				<input type="range" min={0} max={1} step={0.01} value={color.toHsv().v} onChange={handleVChange} />
			</div>
		</div>
	);
};
