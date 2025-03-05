import type { CSSProperties, ReactNode } from "react";
import type { Color } from "../color.ts";

/**
 * transform组件的偏移量
 */
export interface TransformOffset {
	/**
	 * 横向偏移量
	 */
	x: number;

	/**
	 * 纵向偏移量
	 */
	y: number;
}

/**
 * Transform组件的props
 */
export interface TransformProps {
	/**
	 * 偏移量
	 */
	offset?: TransformOffset;

	/**
	 * 子元素
	 */
	children?: ReactNode;
}

/**
 * HSL颜色模型
 */
export interface HSL {
	/**
	 * 色相
	 */
	h: number | string;

	/**
	 * 饱和度
	 */
	s: number | string;

	/**
	 * 明度
	 */
	l: number | string;
}

/**
 * RGB颜色模型
 */
export interface RGB {
	/**
	 * 红色
	 */
	r: number | string;

	/**
	 * 绿色
	 */
	g: number | string;

	/**
	 * 蓝色
	 */
	b: number | string;
}

/**
 * HSLA颜色模型
 */
export interface HSLA extends HSL {
	/**
	 * 透明度
	 */
	a: number;
}

/**
 * RGBA颜色模型
 */
export interface RGBA extends RGB {
	/**
	 * 透明度
	 */
	a: number;
}

/**
 * 颜色类型
 */
export type ColorType = string | number | RGB | RGBA | HSL | HSLA | Color;

/**
 * ColorPicker组件的props
 */
export interface propsType {
	/**
	 * 类名
	 */
	className?: string;

	/**
	 * 样式
	 */
	style?: CSSProperties;

	/**
	 * 颜色值
	 */
	value?: ColorType;

	/**
	 * 默认颜色值
	 */
	defaultValue?: ColorType;

	/**
	 * 颜色值变化时的回调函数
	 */
	onChange?: (color: Color) => void;
}
