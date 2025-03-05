import useMutateObserver from "./hook";
import { useLayoutEffect, useRef, useState, cloneElement } from "react";
import type { FC } from "react";
import type { propsType } from "./types";

/**
 * 监视子元素dom结构变化,并使用useLayoutEffect在视图更新时重新监听
 *
 * 通过onMutate回调获取变化列表(等同于mutationObserver接收的回调),
 * 通过options配置监听器,等同于mutationObserver的options
 *
 *  props:
 *    options:  MutationObserverInit,配置监听器
 *    onMutate: (mutations: MutationRecord[], observer: MutationObserver) => void,变化回调
 *    children: ReactElement,子元素
 */
const MutateObserver: FC<propsType> = (props) => {
	const { options, onMutate = () => {}, children } = props;

	/**
	 * ref,用于获取子元素的dom
	 */
	const elementRef = useRef<HTMLElement>(null);

	/**
	 * target,用于储存子元素的dom
	 */
	const [target, setTarget] = useState<HTMLElement>();

	/**
	 * 使用useMutateObserver hook
	 * 监听target的变化
	 */
	useMutateObserver(target!, onMutate, options);

	/**
	 * 使用useLayoutEffect hook
	 * 在视图更新时重新监听target的变化
	 */
	useLayoutEffect(() => {
		/**
		 * 将elementRef.current赋值给target
		 */
		setTarget(elementRef.current!);
	}, []);

	/**
	 * 如果children不存在,则不渲染
	 */
	if (!children) {
		return null;
	}

	/**
	 * cloneElement,将children克隆,并将ref赋值给elementRef
	 */
	return cloneElement(children, { ref: elementRef });
};

export default MutateObserver;
