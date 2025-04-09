/**
 * @file index.tsx
 * @description Portal组件，用于将子元素渲染到DOM树的其他位置
 */

/** 导入React相关依赖 */
import { forwardRef, useEffect, useMemo, useImperativeHandle } from "react";
/** 导入Portal创建方法 */
import { createPortal } from "react-dom";
/** 导入类型定义 */
import type { propsType } from "./types";
/** 导入工具函数 */
import { getAttach } from "./utils";

/**
 * @component Portal
 * @description Portal组件，用于将子元素渲染到DOM树的其他位置
 * @param {propsType} props - 组件属性
 * @property {string | HTMLElement} [attach] - 挂载点，可以是选择器字符串或DOM元素
 * @property {React.ReactNode} children - 子元素
 * @param {React.RefObject<HTMLElement>} ref - 组件引用
 */
const Portal = forwardRef((props: propsType, ref) => {
	/** 解构props */
	const { attach = document.body, children } = props;

	/** 创建容器元素 */
	const container = useMemo(() => {
		const el = document.createElement("div");
		el.className = `portal-wrapper`;
		return el;
	}, []);

	/** 挂载和卸载容器元素 */
	useEffect(() => {
		/** 获取父元素 */
		const parentElement = getAttach(attach);
		/** 挂载容器 */
		parentElement?.appendChild?.(container);

		/** 清理函数 */
		return () => {
			/** 卸载容器 */
			parentElement?.removeChild?.(container);
		};
	}, [container, attach]);

	/** 暴露容器元素给ref */
	useImperativeHandle(ref, () => container);

	/** 使用Portal渲染子元素 */
	return createPortal(children, container);
});

export default Portal;
