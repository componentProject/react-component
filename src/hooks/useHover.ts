import { cloneElement, useState } from "react";
import type { ReactElement } from "react";
export type Element = ((state: boolean) => ReactElement) | ReactElement;

/**
 * 监听ref是否处于鼠标悬浮状态
 * @param element
 */
const useHover = (element: Element): [ReactElement, boolean] => {
	const [state, setState] = useState(false);

	const onMouseEnter = (originalOnMouseEnter?: any) => (event: any) => {
		originalOnMouseEnter?.(event);
		setState(true);
	};
	const onMouseLeave = (originalOnMouseLeave?: any) => (event: any) => {
		originalOnMouseLeave?.(event);
		setState(false);
	};

	if (typeof element === "function") {
		element = element(state);
	}

	const el = cloneElement(element, {
		onMouseEnter: onMouseEnter(element.props.onMouseEnter),
		onMouseLeave: onMouseLeave(element.props.onMouseLeave),
	});

	return [el, state];
};

export default useHover;
