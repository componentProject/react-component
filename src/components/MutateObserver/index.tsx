import useMutateObserver from './hook'
import {useLayoutEffect, useRef, useState, cloneElement} from 'react';
import type {ReactElement, FC} from "react";

interface MutationObserverProps {
	options?: MutationObserverInit;
	onMutate?: (mutations: MutationRecord[], observer: MutationObserver) => void;
	children: ReactElement;
}

/**
 * 监视子元素dom结构变化,并使用useLayoutEffect在视图更新时重新监听
 *
 * 通过onMutate回调获取变化列表(等同于mutationObserver接收的回调),
 * 通过options配置监听器,等同于mutationObserver的options
 */
const MutateObserver: FC<MutationObserverProps> = props => {
	const {
		options,
		onMutate = () => {
		},
		children,
	} = props;

	const elementRef = useRef<HTMLElement>(null);

	const [target, setTarget] = useState<HTMLElement>();

	useMutateObserver(target!, onMutate, options);

	useLayoutEffect(() => {
		setTarget(elementRef.current!);
	}, []);

	if (!children) {
		return null;
	}

	return cloneElement(children, {ref: elementRef});
}

export default MutateObserver;
