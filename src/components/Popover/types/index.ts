import type { CSSProperties, PropsWithChildren, ReactNode } from "react";

/**
 * 气泡框的对齐方式
 * 可以是 "start" 或 "end"
 */
type Alignment = "start" | "end";

/**
 * 气泡框的方位
 * 可以是 "top"、"right"、"bottom" 或 "left"
 */
type Side = "top" | "right" | "bottom" | "left";

/**
 * 气泡框的对齐方式和方位的组合
 * 例如 "top-start"、"right-end" 等
 */
type AlignedPlacement = `${Side}-${Alignment}`;

/**
 * 气泡框的方位
 * 可以是一个基本的方位 Side
 * 也可以是一个组合的方位 AlignedPlacement
 */
export type placementType = Side | AlignedPlacement;

/**
 * 气泡框的 props
 */
export interface propsType extends PropsWithChildren {
	/**
	 * 气泡框的内容
	 */
	content?: ReactNode;

	/**
	 * 触发气泡框的方式
	 * 可以是 "hover" 或 "click"
	 */
	trigger?: "hover" | "click";

	/**
	 * 气泡框的方位
	 */
	placement?: placementType;

	/**
	 * 气泡框是否显示
	 */
	open?: boolean;

	/**
	 * 气泡框的显示状态变化的回调函数
	 * @param open - 气泡框是否显示
	 */
	onOpenChange?: (open: boolean) => void;

	/**
	 * 气泡框的 className
	 */
	className?: string;

	/**
	 * 气泡框的 style
	 */
	style?: CSSProperties;
}
