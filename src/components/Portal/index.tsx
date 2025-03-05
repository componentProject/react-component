import { forwardRef, useEffect, useMemo, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

import type { propsType } from "./types";

import { getAttach } from "./utils";

/**
 *  Portal组件
 *
 *  该组件使用createPortal将子元素挂载到指定容器/body上,
 *  并通过useImperativeHandle返回容器dom,也就是通过ref获取该组件时返回的是容器dom
 *
 *  props:
 *    attach: string/HTMLElement,可选,默认document.body,
 *      如果传入的是 string,就作为选择器来找到对应的 dom 作为挂载点,
 *      如果是 HTMLElement,则直接作为挂载节点,
 *      否则,默认挂载到 document.body
 *    children: ReactNode,必填,
 *      该组件的子元素
 */
const Portal = forwardRef((props: propsType, ref) => {
	/**
	 *  props解构
	 *
	 *  attach: string/HTMLElement,可选,默认document.body,
	 *    如果传入的是 string,就作为选择器来找到对应的 dom 作为挂载点,
	 *    如果是 HTMLElement,则直接作为挂载节点,
	 *    否则,默认挂载到 document.body
	 *  children: ReactNode,必填,
	 *    该组件的子元素
	 */
	const { attach = document.body, children } = props;

	/**
	 *  useMemo 创建容器dom
	 *
	 *  const el = document.createElement("div");
	 *  el.className = 'portal-wrapper';
	 *  return el;
	 */
	const container = useMemo(() => {
		const el = document.createElement("div");
		el.className = `portal-wrapper`;
		return el;
	}, []);

	/**
	 *  useEffect挂载容器dom
	 *
	 *  const parentElement = getAttach(attach);
	 *  parentElement?.appendChild?.(container);
	 *
	 *  return () => {
	 *    parentElement?.removeChild?.(container);
	 *  };
	 */
	useEffect(() => {
		const parentElement = getAttach(attach);
		parentElement?.appendChild?.(container);

		return () => {
			parentElement?.removeChild?.(container);
		};
	}, [container, attach]);

	/**
	 *  useImperativeHandle返回容器dom
	 *
	 *  useImperativeHandle(ref, () => container);
	 */
	useImperativeHandle(ref, () => container);

	/**
	 *  createPortal将子元素挂载到容器dom上
	 *
	 *  return createPortal(children, container);
	 */
	return createPortal(children, container);
});

export default Portal;
