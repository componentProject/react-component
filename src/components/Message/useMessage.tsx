import { useContext } from "react";
import { ConfigContext } from "./ConfigProvider";
import type { MessageRef } from "./MessageProvider.tsx";

export function useMessage(): MessageRef {
	const { messageRef } = useContext(ConfigContext);

	console.log("messageRef", messageRef);
	if (!messageRef) {
		throw new Error("请在最外层添加 ConfigProvider 组件");
	}

	return messageRef.current!;
}
