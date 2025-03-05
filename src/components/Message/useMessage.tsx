import { useContext } from "react";
import type { MessageRef } from "./types";
import { ConfigContext } from "./ConfigProvider";

/**
 * 使用 Context 获取 MessageProvider 的 ref
 *
 * 该 hook 仅能在 ConfigProvider 的子组件中使用
 *
 * @returns MessageProvider 的 ref
 */
export function useMessage(): MessageRef {
	const { messageRef } = useContext(ConfigContext);

	/**
	 * 如果 messageRef 不存在，则抛出错误
	 *
	 * 这是因为 ConfigProvider 是 MessageProvider 的上下文提供者
	 * 在 ConfigProvider 之外使用 useMessage hook 是无效的
	 */
	if (!messageRef) {
		throw new Error("请在最外层添加 ConfigProvider 组件");
	}

	/**
	 * 返回 messageRef 的值
	 *
	 * messageRef 的值是 MessageProvider 的 ref
	 * 我们可以通过 messageRef.current 来使用 MessageProvider 的 api
	 */
	return messageRef.current!;
}
