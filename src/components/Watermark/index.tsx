import { useRef, useCallback, useEffect } from "react";
import type { FC } from "react";
import useWatermark from "./hooks/useWatermark.ts";
import type { propsType } from "./types";

/** Watermark组件 */
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
