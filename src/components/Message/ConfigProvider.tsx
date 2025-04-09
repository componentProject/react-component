/**
 * @file ConfigProvider.tsx
 * @description 配置提供者组件，用于提供全局配置
 */

/** 导入React相关依赖 */
import { createContext, useRef } from "react";
/** 导入类型定义 */
import type { PropsWithChildren, RefObject } from "react";
/** 导入消息提供者组件 */
import { MessageProvider } from "./MessageProvider.tsx";
/** 导入消息引用类型 */
import type { MessageRef } from "./types";

/**
 * ConfigProvider 的 props
 *
 * @property {RefObject<MessageRef>} [messageRef] -  MessageProvider 的 ref
 */
interface ConfigProviderProps {
	messageRef?: RefObject<MessageRef>;
}

/**
 * ConfigProvider 的 context
 */
export const ConfigContext = createContext<ConfigProviderProps>({});

/**
 * ConfigProvider 组件，用于包装 MessageProvider
 *
 * @param {PropsWithChildren} props - props
 */
export function ConfigProvider(props: PropsWithChildren) {
	/** 解构子组件 */
	const { children } = props;

	/**
	 * messageRef 是 MessageProvider 的 ref
	 * 用于在外部使用 MessageProvider 的 api
	 */
	const messageRef = useRef<MessageRef>(null);

	return (
		/**
		 * ConfigContext.Provider 是 React Context 的 provider
		 * value 是 ConfigProvider 的 props
		 * children 是 ConfigProvider 的子组件
		 */
		<ConfigContext.Provider value={{ messageRef }}>
			{/* MessageProvider 是 Message 组件的 provider，ref 是 MessageProvider 的 ref */}
			<MessageProvider ref={messageRef} />
			{/* 渲染子组件 */}
			{children}
		</ConfigContext.Provider>
	);
}
