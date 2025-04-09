/**
 * @file Watermark/index.tsx
 * @description 水印组件，用于在页面上添加水印
 */

import { useRef, useCallback, useEffect } from "react";
import type { FC } from "react";
import useWatermark from "./hooks/useWatermark.ts";
import type { propsType } from "./types";

/**
 * @interface WatermarkProps
 * @description 水印组件的属性接口
 * @property {string} [className] - 自定义类名
 * @property {React.CSSProperties} [style] - 自定义样式
 * @property {number} [zIndex] - 水印层级
 * @property {number} [width] - 水印宽度
 * @property {number} [height] - 水印高度
 * @property {number} [rotate] - 水印旋转角度
 * @property {string} [image] - 水印图片URL
 * @property {string} [content] - 水印文本内容
 * @property {React.CSSProperties} [fontStyle] - 水印文本样式
 * @property {[number, number]} [gap] - 水印间距
 * @property {[number, number]} [offset] - 水印偏移量
 * @property {() => HTMLElement} [getContainer] - 获取水印容器函数
 */

/**
 * @component Watermark
 * @description 水印组件，用于在页面上添加水印，支持文本和图片水印
 * @param {WatermarkProps} props - 组件属性
 * @returns {JSX.Element} 水印组件
 */
const Watermark: FC<propsType> = (props) => {
	/** 解构props */
	const { className, style, zIndex, width, height, rotate, image, content, fontStyle, gap, offset } = props;

	/** ref容器 */
	const containerRef = useRef<HTMLDivElement>(null);

	/** 获取容器 */
	const getContainer = useCallback(() => {
		/** 如果props中传入了getContainer,则使用getContainer */
		return props.getContainer ? props.getContainer() : containerRef.current!;
	}, [containerRef.current, props.getContainer]);

	/** 使用useWatermark hook */
	const { generateWatermark } = useWatermark({
		zIndex,
		width,
		height,
		rotate,
		image,
		content,
		fontStyle,
		gap,
		offset,
		getContainer,
	});

	/** 重新渲染水印 */
	useEffect(() => {
		generateWatermark({
			zIndex,
			width,
			height,
			rotate,
			image,
			content,
			fontStyle,
			gap,
			offset,
			getContainer,
		});
	}, [
		zIndex,
		width,
		height,
		rotate,
		image,
		content,
		JSON.stringify(props.fontStyle),
		JSON.stringify(props.gap),
		JSON.stringify(props.offset),
		getContainer,
	]);

	/** 渲染Watermark */
	return props.children ? (
		/** 如果props中传入了children,则渲染children */
		<div className={className} style={style} ref={containerRef}>
			{props.children}
		</div>
	) : null;
};

export default Watermark;
