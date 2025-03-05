import type { CSSProperties, PropsWithChildren } from "react";

export interface propsType extends PropsWithChildren {
	/**
	 *  custom style
	 */
	style?: CSSProperties;
	/**
	 *  custom className
	 */
	className?: string;
	/**
	 *  custom zIndex
	 */
	zIndex?: string | number;
	/**
	 *  custom width
	 */
	width?: number;
	/**
	 *  custom height
	 */
	height?: number;
	/**
	 *  旋转角度,单位度数
	 */
	rotate?: number;
	/**
	 *  图片路径,与文字互斥
	 */
	image?: string;
	/**
	 *  文字内容
	 */
	content?: string | string[];
	/**
	 *  文字样式
	 */
	fontStyle?: {
		/**
		 *  文字颜色
		 */
		color?: string;
		/**
		 *  文字字体
		 */
		fontFamily?: string;
		/**
		 *  文字大小
		 */
		fontSize?: number | string;
		/**
		 *  文字粗细
		 */
		fontWeight?: number | string;
	};
	/**
	 *  x轴和y轴的间隔
	 */
	gap?: [number, number];
	/**
	 *  x轴和y轴的偏移量
	 */
	offset?: [number, number];
	/**
	 *  获取容器,如果不提供,将使用body
	 */
	getContainer?: () => HTMLElement;
}
