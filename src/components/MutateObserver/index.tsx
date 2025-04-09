/**
 * @file index.tsx
 * @description 监听DOM变化的组件
 */

/** 导入自定义hook */
import useMutateObserver from "./hook";
/** 导入React相关依赖 */
import { useLayoutEffect, useRef, useState, cloneElement } from "react";
/** 导入类型定义 */
import type { FC } from "react";
/** 导入属性类型 */
import type { propsType } from "./types";

/**
 * @component MutateObserver
 * @description 监视子元素DOM结构变化的组件
 * @param {propsType} props - 组件属性
 * @property {MutationObserverInit} [options] - 监听器配置
 * @property {(mutations: MutationRecord[], observer: MutationObserver) => void} [onMutate] - 变化回调函数
 * @property {React.ReactElement} children - 子元素
 */
const MutateObserver: FC<propsType> = (props) => {
	/** 解构props */
	const { options, onMutate = () => {}, children } = props;

	/** 创建子元素ref */
	const elementRef = useRef<HTMLElement>(null);

	/** 创建目标元素状态 */
	const [target, setTarget] = useState<HTMLElement>();

	/** 使用自定义hook监听目标元素变化 */
	useMutateObserver(target!, onMutate, options);

	/** 在视图更新时重新设置目标元素 */
	useLayoutEffect(() => {
		/** 设置目标元素 */
		setTarget(elementRef.current!);
	}, []);

	/** 如果没有子元素则不渲染 */
	if (!children) {
		return null;
	}

	/** 克隆子元素并添加ref */
	return cloneElement(children, { ref: elementRef });
};

export default MutateObserver;
