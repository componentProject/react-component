import cs from "classnames";
import type { propsType } from "../types";
import { Color } from "../color.ts";
import Palette from "./Palette.tsx";
import "../index.scss";
import { useControllableValue } from "ahooks";

// ColorPickerPanel 是一个颜色选择器面板组件
// props:
// - className: 颜色选择器的class name
// - style: 颜色选择器的style
// - onChange: 颜色选择器变化时的回调函数
function ColorPickerPanel(props: propsType) {
	const { className, style, onChange } = props;

	//  colorValue 是当前选择的颜色
	//  setColorValue 是更新colorValue的函数
	//  useControllableValue 是一个hook,用于处理受控和非受控组件
	//  colorValue的类型是Color
	const [colorValue, setColorValue] = useControllableValue<Color>(props);

	// classNames 是class name的合并
	// cs 是一个utility函数,用于合并class name
	const classNames = cs("color-picker", className);

	// onPaletteColorChange 是 Palette 选择器变化时的回调函数
	//  color 是当前选择的颜色
	function onPaletteColorChange(color: Color) {
		// setColorValue 是更新colorValue的函数
		setColorValue(color);
		// onChange 是props传递的回调函数
		onChange?.(color);
	}

	// ColorPickerPanel 的渲染
	return (
		<div className={classNames} style={style}>
			<Palette
				color={colorValue}
				// onPaletteColorChange 是 Palette 选择器变化时的回调函数
				onChange={onPaletteColorChange}
			></Palette>
			<div
				// 颜色选择器的颜色展示
				style={{ width: 20, height: 20, background: colorValue.toRgbString() }}
			></div>
		</div>
	);
}

export default ColorPickerPanel;
