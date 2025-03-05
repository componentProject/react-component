import type { ReactNode } from "react";

/**
 * Portal组件的props类型
 *
 * @property {HTMLElement | string} [attach] -  Portal组件挂载的容器，可以是 HTMLElement 或者字符串
 *                                              如果是字符串，就作为选择器来找到对应的 dom 作为挂载点，
 *                                              如果是 HTMLElement，则直接作为挂载节点，
 *                                              否则，默认挂载到 document.body
 * @property {ReactNode} children - Portal组件的子元素
 */
export interface propsType {
	attach?: HTMLElement | string;
	children: ReactNode;
}
