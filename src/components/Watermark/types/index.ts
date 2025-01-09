import { CSSProperties, PropsWithChildren } from "react";

export interface WatermarkProps extends PropsWithChildren {
	style?: CSSProperties;
	className?: string;
	zIndex?: string | number;
	width?: number;
	height?: number;
	/**
	 * 旋转角度
	 */
	rotate?: number;
	/**
	 * 图片路径,与文字互斥
	 */
	image?: string;
	/**
	 * 文字内容
	 */
	content?: string | string[];
	fontStyle?: {
		color?: string;
		fontFamily?: string;
		fontSize?: number | string;
		fontWeight?: number | string;
	};
	/**
	 * x轴和y轴的间隔
	 */
	gap?: [number, number];
	/**
	 * x轴和y轴的偏移量
	 */
	offset?: [number, number];
	getContainer?: () => HTMLElement;
}
