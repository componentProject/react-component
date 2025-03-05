import { useState } from "react";
import type { MessageProps, Position } from "./types";
import { getId } from "@/utils";

export type MessageList = {
	top: MessageProps[];
	bottom: MessageProps[];
};

const initialState = {
	top: [],
	bottom: [],
};

function useStore(defaultPosition: Position) {
	const [messageList, setMessageList] = useState<MessageList>({ ...initialState });

	return {
		/**
		 * messageList 是当前存储的消息列表，分为顶部和底部
		 */
		messageList,

		/**
		 * 添加消息的方法
		 * @param messageProps 消息属性
		 * @returns 消息的唯一标识符 id
		 */
		add: (messageProps: MessageProps) => {
			const id = getId(messageProps);
			setMessageList((preState) => {
				if (messageProps?.id) {
					const position = getMessagePosition(preState, messageProps.id);
					if (position) return preState;
				}

				const position = messageProps.position || defaultPosition;
				const isTop = position.includes("top");
				const messages = isTop
					? [{ ...messageProps, id }, ...(preState[position] ?? [])]
					: [...(preState[position] ?? []), { ...messageProps, id }];

				return {
					...preState,
					[position]: messages,
				};
			});
			return id;
		},

		/**
		 * 更新消息的方法
		 * @param id 消息的唯一标识符
		 * @param messageProps 更新的消息属性
		 */
		update: (id: number, messageProps: MessageProps) => {
			if (!id) return;

			setMessageList((preState) => {
				const nextState = { ...preState };
				const { position, index } = findMessage(nextState, id);

				if (position && index !== -1) {
					nextState[position][index] = {
						...nextState[position][index],
						...messageProps,
					};
				}

				return nextState;
			});
		},

		/**
		 * 移除消息的方法
		 * @param id 消息的唯一标识符
		 */
		remove: (id: number) => {
			setMessageList((prevState) => {
				const position = getMessagePosition(prevState, id);

				if (!position) return prevState;
				return {
					...prevState,
					[position]: prevState[position].filter((notice) => notice.id !== id),
				};
			});
		},

		/**
		 * 清空所有消息的方法
		 */
		clearAll: () => {
			setMessageList({ ...initialState });
		},
	};
}

/**
 * 获取消息所在位置的方法
 * @param messageList 消息列表
 * @param id 消息的唯一标识符
 * @returns 消息所在的位置
 */
export function getMessagePosition(messageList: MessageList, id: number) {
	for (const [position, list] of Object.entries(messageList)) {
		if (list.find((item) => item.id === id)) {
			return position as Position;
		}
	}
}

/**
 * 查找消息的方法
 * @param messageList 消息列表
 * @param id 消息的唯一标识符
 * @returns 包含消息所在位置和索引的对象
 */
export function findMessage(messageList: MessageList, id: number) {
	const position = getMessagePosition(messageList, id);

	const index = position ? messageList[position].findIndex((message) => message.id === id) : -1;

	return {
		position,
		index,
	};
}

export default useStore;
