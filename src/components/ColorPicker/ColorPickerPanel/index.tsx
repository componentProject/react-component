/**
 * @file index.tsx
 * @description 颜色选择器面板组件
 */

/** 导入classnames工具函数 */
import cs from "classnames";
/** 导入组件属性类型 */
import type { propsType } from "../types";
/** 导入Color类 */
import { Color } from "../color.ts";
/** 导入Palette组件 */
import Palette from "./Palette.tsx";
/** 导入样式文件 */
import "../index.scss";
/** 导入useControllableValue hook */
import { useControllableValue } from "ahooks";

/**
 * @component ColorPickerPanel
 * @description 颜色选择器面板组件，用于选择和管理颜色
 * @param {propsType} props - 组件属性
 * @property {string} [className] - 自定义类名
 * @property {React.CSSProperties} [style] - 自定义样式
 * @property {(color: Color) => void} [onChange] - 颜色变化时的回调函数
 */
function ColorPickerPanel(props: propsType) {
	/** 解构props获取className、style和onChange */
	const { className, style, onChange } = props;

	/** 使用useControllableValue hook管理颜色值 */
	const [colorValue, setColorValue] = useControllableValue<Color>(props);

	/** 合并类名 */
	const classNames = cs("color-picker", className);

	/**
	 * 处理调色板颜色变化
	 * @param {Color} color - 新选择的颜色
	 */
	function onPaletteColorChange(color: Color) {
		/** 更新颜色值 */
		setColorValue(color);
		/** 调用onChange回调 */
		onChange?.(color);
	}

	{
		/* 颜色选择器面板容器 */
	}
	return (
		<div className={classNames} style={style}>
			{/* 调色板组件 */}
			<Palette color={colorValue} onChange={onPaletteColorChange}></Palette>
			{/* 颜色预览区域 */}
			<div style={{ width: 20, height: 20, background: colorValue.toRgbString() }}></div>
		</div>
	);
}

export default ColorPickerPanel;
