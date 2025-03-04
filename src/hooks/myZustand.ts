import { useSyncExternalStore } from "react";

// 创建一个store的工厂函数，接收一个初始化state的函数createState
const createStore = (
	createState: (setState: (partial: any, replace: boolean | any) => void, getState: () => object, api: any) => object,
) => {
	// state
	let state: object;
	// store的listeners回调
	const listeners: Set<(state: object, previousState: object) => void> = new Set();

	// store的setState方法
	const setState = (partial: any, replace: boolean | any) => {
		const nextState = typeof partial === "function" ? partial(state) : partial;

		if (!Object.is(nextState, state)) {
			const previousState = state;

			if (!replace) {
				state = typeof nextState !== "object" || nextState === null ? nextState : Object.assign({}, state, nextState);
			} else {
				state = nextState;
			}
			listeners.forEach((listener) => listener(state, previousState));
		}
	};

	// 获取当前state的方法
	const getState = () => state;

	// 添加listener的方法
	const subscribe = (listener: (state: object, previousState: object) => void) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};

	// 清除所有listener的方法
	const destroy = () => {
		listeners.clear();
	};

	// store的API接口
	const api = { setState, getState, subscribe, destroy };

	// 初始化state
	state = createState(setState, getState, api);

	// 返回store的API接口
	return api;
};

// 自定义hook，用于从store中获取部分state
function useStore(api: any, selector: (state: object) => any) {
	function getState() {
		return selector(api.getState());
	}

	return useSyncExternalStore(api.subscribe, getState);
}

// 创建一个与React组件绑定的store，接收一个初始化state的函数createState
export const create = (
	createState: (setState: (partial: any, replace: boolean | any) => void, getState: () => object, api: any) => object,
) => {
	const api = createStore(createState);

	// 自定义hook，用于从store中获取部分state，并与store绑定
	const useBoundStore = (selector: (state: object) => any) => useStore(api, selector);

	// 将store的API接口合并到useBoundStore中
	Object.assign(useBoundStore, api);

	// 返回绑定后的store
	return useBoundStore;
};
