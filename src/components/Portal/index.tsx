import {forwardRef, useEffect, useMemo, useImperativeHandle} from 'react';
import {createPortal} from 'react-dom';

export interface PortalProps {
	attach?: HTMLElement | string;
	children: React.ReactNode;
}


/**
 * 通过createPortal将子元素挂载到指定容器/body上,并通过useImperativeHandle返回容器dom,也就是通过ref获取该组件时返回的是容器dom
 *
 * 如果传入的是 string，就作为选择器来找到对应的 dom 作为挂载点，
 *
 * 如果是 HTMLElement，则直接作为挂载节点，
 *
 * 否则，默认挂载到 document.body：
 */
const Portal = forwardRef((props: PortalProps, ref) => {
	const {
		attach = document.body,
		children
	} = props;

	const container = useMemo(() => {
		const el = document.createElement('div');
		el.className = `portal-wrapper`;
		return el;
	}, []);

	useEffect(() => {
		const parentElement = getAttach(attach);
		parentElement?.appendChild?.(container);

		return () => {
			parentElement?.removeChild?.(container);
		};
	}, [container, attach]);

	useImperativeHandle(ref, () => container);

	return createPortal(children, container);
});

export default Portal;

export function getAttach(attach: PortalProps['attach']) {
	if (typeof attach === 'string') {
		return document.querySelector(attach);
	}
	if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
		return attach;
	}

	return document.body;
}
