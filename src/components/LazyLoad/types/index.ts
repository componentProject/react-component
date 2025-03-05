import type { CSSProperties, ReactNode } from "react";

/**
 * LazyLoad组件的props类型
 *
 * @property {string} [className] - 自定义 className
 * @property {CSSProperties} [style] - 自定义 style
 * @property {ReactNode} [placeholder] - 占位符，loading时显示的内容
 * @property {string | number} [offset] -  offset distance to trigger the content visible
 * @property {number | string} [width] - 自定义宽度
 * @property {string | number} [height] - 自定义高度
 * @property {() => void} [onContentVisible] - 内容可见时的回调函数
 * @property {ReactNode} children - LazyLoad组件的子元素
 */
export interface propsType {
	className?: string;
	style?: CSSProperties;
	placeholder?: ReactNode;
	offset?: string | number;
	width?: number | string;
	height?: string | number;
	onContentVisible?: () => void;
	children: ReactNode;
}
