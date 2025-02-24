import cs from "classnames";
import type { propsType } from "./types";
import { Color } from "./color";
import Palette from "./Palette";
import "./index.scss";
import { useControllableValue } from "ahooks";

function ColorPickerPanel(props: propsType) {
	const { className, style, onChange } = props;

	const [colorValue, setColorValue] = useControllableValue<Color>(props);

	const classNames = cs("color-picker", className);

	function onPaletteColorChange(color: Color) {
		setColorValue(color);
		onChange?.(color);
	}

	return (
		<div className={classNames} style={style}>
			<Palette color={colorValue} onChange={onPaletteColorChange}></Palette>
			<div style={{ width: 20, height: 20, background: colorValue.toRgbString() }}></div>
		</div>
	);
}

export default ColorPickerPanel;
