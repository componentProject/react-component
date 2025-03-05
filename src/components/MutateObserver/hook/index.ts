import { useEffect } from "react";

/**
 * 默认的MutationObserverInit配置对象
 * 该配置对象将被传递给MutationObserver的构造函数
 * 以下是它的配置项：
 *  - subtree: 一个布尔值，表示观察器是否观察到目标节点的所有后代节点
 *  - childList: 一个布尔值，表示观察器是否观察到目标节点的子节点列表的变化
 *  - attributeFilter: 一个数组，表示观察器所关心的目标节点的哪些属性的变化
 *    例如，["style", "class"]表示观察器仅关心目标节点的style和class属性的变化
 */
const defaultOptions: MutationObserverInit = {
	subtree: true,
	childList: true,
	attributeFilter: ["style", "class"],
};

/**
 * 一个hook函数，用于在React组件中使用MutationObserver
 * 该函数将在组件mount时创建一个MutationObserver实例
 * 并将该实例与传入的节点或节点列表关联起来
 * 该函数还将在组件unmount时销毁该实例
 *
 * @param nodeOrList 一个节点或节点列表
 *                  该参数将被传递给MutationObserver的observe方法
 * @param callback 一个回调函数
 *                  该函数将在MutationObserver观察到目标节点的变化时被调用
 * @param options 一个MutationObserverInit配置对象
 *                  该参数将被传递给MutationObserver的构造函数
 *                  该对象的配置项将被用来配置MutationObserver的行为
 */
export default function useMutateObserver(
	nodeOrList: HTMLElement | HTMLElement[],
	callback: MutationCallback,
	options: MutationObserverInit = defaultOptions,
) {
	useEffect(() => {
		if (!nodeOrList) {
			return;
		}

		let instance: MutationObserver;

		/**
		 * 将传入的节点或节点列表转换为一个节点列表
		 * 该列表将被用来作为MutationObserver的观察目标
		 */
		const nodeList = Array.isArray(nodeOrList) ? nodeOrList : [nodeOrList];

		if ("MutationObserver" in window) {
			instance = new MutationObserver(callback);

			/**
			 * 遍历节点列表，并将每个节点传递给MutationObserver的observe方法
			 * 该方法将使MutationObserver观察到目标节点的变化
			 */
			nodeList.forEach((element) => {
				instance.observe(element, options);
			});
		}

		/**
		 * 一个函数，用于在组件unmount时销毁MutationObserver实例
		 * 该函数将在useEffect的cleanup函数中被调用
		 */
		return () => {
			instance?.takeRecords();
			instance?.disconnect();
		};
	}, [options, nodeOrList]);
}
