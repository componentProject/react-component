import type { CSSProperties, ReactNode, SVGAttributes } from "react";

/**
 * 基础图标属性类型定义
 * @property {string} [className] - 自定义类名
 * @property {CSSProperties} [style] - 自定义样式
 * @property {string | string[]} [size] - 图标大小，可以是字符串或字符串数组
 * @property {boolean} [spin] - 是否旋转图标
 */
type BaseIconProps = {
	className?: string;
	style?: CSSProperties;
	size?: string | string[];
	spin?: boolean;
};

/**
 * 图标属性类型定义，继承自基础图标属性类型，并排除与SVG属性冲突的部分
 */
export type IconProps = BaseIconProps & Omit<SVGAttributes<SVGElement>, keyof BaseIconProps>;

/**
 * IconFont组件属性类型定义
 * @property {CSSProperties} [style] - 自定义样式
 * @property {string} [scriptUrl] - Iconfont脚本URL
 * @property {string} [type] - 图标类型
 * @property {string} [className] - 自定义类名
 * @property {string | string[]} [size] - 图标大小，可以是字符串或字符串数组
 * @property {boolean} [spin] - 是否旋转图标
 * @property {string} [color] - 图标颜色
 * @property {ReactNode} [children] - 子节点
 */
export interface IconFontProps {
	style?: CSSProperties;
	scriptUrl?: string;
	type?: string;
	className?: string;
	size?: string | string[];
	spin?: boolean;
	color?: string;
	children?: ReactNode;
}
