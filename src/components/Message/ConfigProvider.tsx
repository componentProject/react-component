import { createContext, useRef } from "react";
import type { PropsWithChildren, RefObject } from "react";
import { MessageProvider } from "./MessageProvider.tsx";
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
			{/* * MessageProvider 是 Message 组件的 provider * ref 是 MessageProvider 的 ref */}
			<MessageProvider ref={messageRef} />
			{children}
		</ConfigContext.Provider>
	);
}
