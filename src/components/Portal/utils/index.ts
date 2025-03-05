import type { propsType } from "../types";

/**
 * 该函数用于根据attach参数的值，获取对应的dom元素
 * attach参数可以是string、HTMLElement对象或者undefined
 * 如果attach是string，那么就使用querySelector方法根据该字符串来查找对应的dom元素
 * 如果attach是HTMLElement对象，那么就直接返回该对象
 * 如果attach是undefined，那么就返回document.body
 * @param attach - 可以是string、HTMLElement对象或者undefined
 * @returns - attach对应的dom元素
 */
export function getAttach(attach: propsType["attach"]) {
	if (typeof attach === "string") {
		/* 如果attach是string，那么就使用querySelector方法根据该字符串来查找对应的dom元素 */
		return document.querySelector(attach);
	}
	if (typeof attach === "object" && attach instanceof window.HTMLElement) {
		/* 如果attach是HTMLElement对象，那么就直接返回该对象 */
		return attach;
	}

	/* 如果attach是undefined，那么就返回document.body */
	return document.body;
}
