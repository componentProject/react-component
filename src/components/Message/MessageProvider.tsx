/**
 * @file MessageProvider.tsx
 * @description 消息提供者组件，用于管理和显示消息
 */

/** 导入React相关依赖 */
import { forwardRef } from "react";
/** 导入类型定义 */
import type { FC } from "react";
/** 导入消息组件相关类型 */
import type { MessageProps, MessageRef, Position } from "./types";
/** 导入过渡动画组件 */
import { CSSTransition, TransitionGroup } from "react-transition-group";
/** 导入状态管理hook */
import useStore from "./useStore";
/** 导入Portal渲染方法 */
import { createPortal } from "react-dom";
/** 导入定时器hook */
import { useTimer } from "./useTimer";

/** 导入样式文件 */
import "./MessageProvider.scss";

/** 定义一个MessageItem组件，接收MessageProps类型的item作为参数 */
const MessageItem: FC<MessageProps> = (item) => {
	/** 使用自定义hook useTimer来管理定时器 */
	const { onMouseEnter, onMouseLeave } = useTimer({
		id: item.id! /** 消息的唯一标识符 */,
		duration: item.duration /** 消息显示的持续时间 */,
		remove: item.onClose! /** 消息关闭时执行的回调函数 */,
	});

	return (
		/** 使用div容器包裹消息内容，并绑定鼠标进入和离开事件 */
		<div className="message-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			{/* 消息的内容 */}
			{item.content}
		</div>
	);
};

/** 定义MessageProvider组件，并使用forwardRef将ref转发给子组件 */
export const MessageProvider = forwardRef<MessageRef, any>((_props, ref) => {
	/** 使用自定义hook useStore来管理消息列表和操作方法 */
	const { messageList, add, update, remove, clearAll } = useStore("top");

	/** 将操作方法暴露给父组件 */
	if ("current" in ref!) {
		ref.current = {
			/** 添加消息的方法 */
			add,
			/** 更新消息的方法 */
			update,
			/** 删除消息的方法 */
			remove,
			/** 清空所有消息的方法 */
			clearAll,
		};
	}

	/** 获取所有消息的方向位置 */
	const positions = Object.keys(messageList) as Position[];

	/** 定义消息容器 */
	const messageWrapper = (
		<div className="message-wrapper">
			{positions.map((direction) => {
				return (
					<div className={`message-wrapper-${direction}`} key={direction}>
						<TransitionGroup>
							{messageList[direction].map((item) => {
								return (
									<CSSTransition key={item.id} timeout={1000} classNames="message">
										{/* 渲染消息项组件 */}
										<MessageItem onClose={remove} {...item}></MessageItem>
									</CSSTransition>
								);
							})}
						</TransitionGroup>
					</div>
				);
			})}
		</div>
	);

	/** 使用ReactDOM的createPortal将消息容器渲染到document.body中 */
	return createPortal(messageWrapper, document.body);
});
