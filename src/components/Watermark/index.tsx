import { useRef, FC, useCallback, useEffect } from "react";
import useWatermark from "./hooks/useWatermark.ts";
import type { propsType } from "./types";

const Watermark: FC<propsType> = (props) => {
	const { className, style, zIndex, width, height, rotate, image, content, fontStyle, gap, offset } = props;

	const containerRef = useRef<HTMLDivElement>(null);

	const getContainer = useCallback(() => {
		return props.getContainer ? props.getContainer() : containerRef.current!;
	}, [containerRef.current, props.getContainer]);

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

	return props.children ? (
		<div className={className} style={style} ref={containerRef}>
			{props.children}
		</div>
	) : null;
};

export default Watermark;
