import React, { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { getMaskStyle } from "./getMaskStyle";

import "./index.scss";
import { getId } from "@/utils";

/**
 * 定义Mask组件的属性接口
 * @interface MaskProps
 */
interface MaskProps {
	/** 要应用遮罩的HTML元素 */
	element: HTMLElement;

	/** 遮罩的容器元素，可选 */
	container?: HTMLElement;

	/** 渲染遮罩内容的回调函数，可选 */
	renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;

	/** 动画开始时的回调函数，可选 */
	onAnimationStart?: () => void;

	/** 动画结束时的回调函数，可选 */
	onAnimationEnd?: () => void;
}

/** 定义Mask组件 */
export const Mask: React.FC<MaskProps> = (props) => {
	/** 从props中解构出所需参数 */
	const { element, renderMaskContent, container, onAnimationStart, onAnimationEnd } = props;

	useEffect(() => {
		/** 如果提供了动画开始回调，则执行 */
		onAnimationStart?.();
		/** 设置一个定时器用于执行动画结束回调 */
		const timer = setTimeout(() => {
			onAnimationEnd?.();
		}, 200);

		/** 清除定时器 */
		return () => {
			window.clearTimeout(timer);
		};
	}, [element]);

	/** 创建style状态用于存储遮罩的样式 */
	const [style, setStyle] = useState<CSSProperties>({});

	/** 创建zIndex状态用于存储遮罩的z-index值 */
	const [zIndex, setZIndex] = useState(999);
	useEffect(() => {
		/** 创建ResizeObserver观察容器尺寸变化 */
		const observer = new ResizeObserver(() => {
			const style = getMaskStyle(element, container || document.documentElement);
			/** 更新遮罩样式 */
			setStyle(style);
		});
		/** 开始观察容器元素 */
		observer.observe(container || document.documentElement);
		/** 设置遮罩的z-index值 */
		setZIndex(getId());
	}, []);

	useEffect(() => {
		/** 如果元素不存在则直接返回 */
		if (!element) {
			return;
		}

		/** 将元素滚动到可视区域的中心 */
		element.scrollIntoView({
			block: "center",
			inline: "center",
		});

		const style = getMaskStyle(element, container || document.documentElement);
		/** 更新遮罩样式 */
		setStyle(style);
	}, [element, container]);

	/** 获取遮罩内容 */
	const getContent = () => {
		/** 如果没有提供渲染遮罩内容的函数，返回null */
		if (!renderMaskContent) {
			return null;
		}
		/** 调用提供的渲染遮罩内容的函数 */
		return renderMaskContent(<div className={"mask-content"} style={{ width: "100%", height: "100%" }} />);
	};

	/** 渲染遮罩组件 */
	return (
		<div
			style={{
				zIndex,
				...style,
			}}
			className="mask"
		>
			{getContent()}
		</div>
	);
};
