import type { CSSProperties } from "react";
import type { ReactNode } from "react";

/**
 * MessageRef 接口定义
 * 提供对消息的操作方法
 */
export interface MessageRef {
	/**
	 * 添加消息
	 * @param messageProps 消息属性
	 * @returns 新消息的 ID
	 */
	add: (messageProps: MessageProps) => number;

	/**
	 * 移除消息
	 * @param id 消息的 ID
	 */
	remove: (id: number) => void;

	/**
	 * 更新消息
	 * @param id 消息的 ID
	 * @param messageProps 新的消息属性
	 */
	update: (id: number, messageProps: MessageProps) => void;

	/** 清除所有消息 */
	clearAll: () => void;
}

/** 消息显示的位置类型 */
export type Position = "top" | "bottom";

/**
 * MessageProps 接口定义
 * 定义消息的属性
 */
export interface MessageProps {
	/**
	 * 自定义样式
	 */
	style?: CSSProperties;

	/**
	 * 自定义类名
	 */
	className?: string | string[];

	/**
	 * 消息的内容
	 */
	content: ReactNode | string;

	/**
	 * 消息显示的时长(毫秒)
	 */
	duration?: number;

	/**
	 * 消息关闭时的回调函数
	 */
	onClose?: (...args: any) => void;

	/**
	 * 消息的唯一标识符
	 */
	id?: number;

	/**
	 * 消息显示的位置
	 */
	position?: Position;
}
