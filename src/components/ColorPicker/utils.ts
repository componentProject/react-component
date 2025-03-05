import type { RefObject } from "react";
import { TransformOffset } from "./types";
import { Color } from "./color";

/**
 * 根据偏移量计算颜色
 * @param props
 * @returns
 */
export const calculateColor = (props: {
	/**
	 * 偏移量
	 */
	offset: TransformOffset;
	/**
	 * 容器的ref
	 */
	containerRef: RefObject<HTMLDivElement>;
	/**
	 * 目标的ref
	 */
	targetRef: RefObject<HTMLDivElement>;
	/**
	 * 颜色对象
	 */
	color: Color;
}): Color => {
	const { offset, targetRef, containerRef, color } = props;

	const { width, height } = containerRef.current!.getBoundingClientRect();
	const { width: targetWidth, height: targetHeight } = targetRef.current!.getBoundingClientRect();

	/**
	 * 计算目标的中心偏移
	 */
	const centerOffsetX = targetWidth / 2;
	const centerOffsetY = targetHeight / 2;

	/**
	 * 计算饱和度
	 */
	const saturation = (offset.x + centerOffsetX) / width;
	/**
	 * 计算明度
	 */
	const lightness = 1 - (offset.y + centerOffsetY) / height;

	/**
	 * 将颜色转换为hsv
	 */
	const hsv = color.toHsv();

	/**
	 * 返回一个新的颜色对象
	 */
	return new Color({
		/**
		 * 不变的颜色分量
		 */
		h: hsv.h,
		/**
		 * 计算后的饱和度
		 */
		s: saturation <= 0 ? 0 : saturation,
		/**
		 * 计算后的明度
		 */
		v: lightness >= 1 ? 1 : lightness,
		/**
		 * 不变的alpha分量
		 */
		a: hsv.a,
	});
};

/**
 * 根据颜色计算偏移量
 * @param containerRef
 * @param targetRef
 * @param color
 * @returns
 */
export const calculateOffset = (
	containerRef: RefObject<HTMLDivElement>,
	targetRef: RefObject<HTMLDivElement>,
	color: Color,
): TransformOffset => {
	const { width, height } = containerRef.current!.getBoundingClientRect();
	const { width: targetWidth, height: targetHeight } = targetRef.current!.getBoundingClientRect();

	/**
	 * 计算目标的中心偏移
	 */
	const centerOffsetX = targetWidth / 2;
	const centerOffsetY = targetHeight / 2;

	/**
	 * 将颜色转换为hsv
	 */
	const hsv = color.toHsv();

	/**
	 * 返回偏移量对象
	 */
	return {
		/**
		 * x偏移
		 */
		x: hsv.s * width - centerOffsetX,
		/**
		 * y偏移
		 */
		y: (1 - hsv.v) * height - centerOffsetY,
	};
};
