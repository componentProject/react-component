/**
 * @file index.tsx
 * @description 延迟加载组件，用于优化页面性能
 */

/** 导入React相关依赖 */
import { useEffect, useRef, useState } from "react";
/** 导入类型定义 */
import type { FC } from "react";
/** 导入属性类型 */
import type { propsType } from "./types";

/**
 * @component LazyLoad
 * @description 延迟加载组件，用于优化页面性能
 * @param {propsType} props - 组件属性
 * @property {string} [className] - 自定义类名
 * @property {React.CSSProperties} [style] - 自定义样式
 * @property {number | string} [offset] - 观察器的rootMargin
 * @property {number | string} [width] - 容器宽度
 * @property {number | string} [height] - 容器高度
 * @property {() => void} [onContentVisible] - 组件可见时的回调函数
 * @property {React.ReactNode} [placeholder] - 组件不可见时的占位符
 * @property {React.ReactNode} children - 子组件
 */
const LazyLoad: FC<propsType> = ({ className = "", style, offset, width, onContentVisible, placeholder, height, children }) => {
	/** 创建容器ref，用于观察器的observe */
	const containerRef = useRef<HTMLDivElement>(null);

	/** 创建可见性状态 */
	const [visible, setVisible] = useState(false);

	/** 创建观察器ref */
	const elementObserver = useRef<IntersectionObserver>();

	/**
	 * 处理延迟加载的回调函数
	 * @param {IntersectionObserverEntry[]} entries - 观察器观察的元素数组
	 */
	function lazyLoadHandler(entries: IntersectionObserverEntry[]) {
		/** 获取第一个观察元素 */
		const [entry] = entries;
		const { isIntersecting } = entry;

		/** 如果元素可见，设置状态并执行回调 */
		if (isIntersecting) {
			setVisible(true);
			onContentVisible?.();

			const node = containerRef.current;
			if (node && node instanceof HTMLElement) {
				elementObserver.current?.unobserve(node);
			}
		}
	}

	/** 使用useEffect创建和清理观察器 */
	useEffect(() => {
		/** 设置观察器选项 */
		const options = {
			rootMargin: typeof offset === "number" ? `${offset}px` : offset,
			threshold: 0,
		};

		/** 创建观察器 */
		elementObserver.current = new IntersectionObserver(lazyLoadHandler, options);

		/** 获取容器节点 */
		const node = containerRef.current;

		/** 开始观察容器 */
		if (node instanceof HTMLElement) {
			elementObserver.current.observe(node);
		}

		/** 清理函数 */
		return () => {
			if (node && node instanceof HTMLElement) {
				elementObserver.current?.unobserve(node);
			}
		};
	}, []);

	/** 合并样式对象 */
	const styles = { height, width, ...style };

	/** 渲染组件 */
	{
		/* 容器元素 */
	}
	return (
		<div ref={containerRef} className={className} style={styles}>
			{/* 根据可见性渲染内容或占位符 */}
			{visible ? children : placeholder}
		</div>
	);
};

export default LazyLoad;
