import { forwardRef } from "react";
import type { TransformProps } from "./types";

/**
 * 定义一个Transform组件，使用forwardRef将ref转发到子组件中
 * 该组件用于根据传入的偏移量(offset)来调整子元素的位置
 */
const Transform = forwardRef<HTMLDivElement, TransformProps>((props, ref) => {
	/**
	 * 从props中解构出children和offset
	 * children为需要渲染的子元素
	 * offset用于确定子元素定位的偏移量
	 */
	const { children, offset } = props;

	return (
		/**
		 * 使用div作为容器
		 * 该div容器的样式根据传入的偏移量动态调整
		 */
		<div
			ref={ref} /** 将传递进来的ref赋予这个div */
			style={{
				/**
				 * 使用绝对定位来定位子元素
				 * 根据offset的值来设置left和top以实现偏移
				 * 若offset中的x或y不存在，则默认为0
				 */
				position: "absolute",
				left: offset?.x ?? 0,
				top: offset?.y ?? 0,
				zIndex: 1 /** 设置zIndex为1以确保在其他元素之上 */,
			}}
		>
			{
				/** 渲染传递进来的子元素 */
				children
			}
		</div>
	);
});

export default Transform; /** 导出Transform组件，方便外部使用 */
