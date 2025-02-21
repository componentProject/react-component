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
		value: {
			control: "object",
			type: "{h: number, s: number, v: number}",
		},
		defaultValue: {
			control: "object",
			type: "{h: number, s: number, v: number}",
		},
		onChange: {
			control: "function",
			type: "(color: Color) => void",
		},
	},
};

export default meta;

export const colorPicker = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
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
