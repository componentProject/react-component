import type { ReactElement } from "react";

/** propsType接口定义
 *
 * options: MutationObserver的配置选项
 * onMutate: 当观察的DOM发生变化时调用的回调函数
 * children: 需要观察的React元素
 */
export interface propsType {
	/**
	 * MutationObserver的配置选项
	 *
	 * subtree: 是否监视整个子树
	 * childList: 是否监视直接子节点的变化
	 * attributeFilter: 要监视的属性过滤列表
	 */
	options?: MutationObserverInit;

	/**
	 * 当观察的DOM发生变化时调用的回调函数
	 *
	 * mutations: 包含所有发生变化的MutationRecord对象的列表
	 * observer: 当前的MutationObserver实例
	 */
	onMutate?: (mutations: MutationRecord[], observer: MutationObserver) => void;

	/**
	 * 需要观察的React元素
	 *
	 * 该元素的DOM变化将被MutationObserver监视
	 */
	children: ReactElement;
}
