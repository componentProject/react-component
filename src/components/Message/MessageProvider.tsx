import { forwardRef } from "react";
import type { FC } from "react";
import type { MessageProps, MessageRef, Position } from "./types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useStore from "./useStore";
import { createPortal } from "react-dom";
import { useTimer } from "./useTimer";

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
			{/*消息的内容*/}
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
			add,
			update,
			remove,
			clearAll,
		};
	}

	const positions = Object.keys(messageList) as Position[]; /** 获取所有消息的方向位置 */

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
