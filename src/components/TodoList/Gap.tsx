/**
 * @file Gap.tsx
 * @description 待办事项列表的间隔组件
 */

/**
 * @description 导入 classNames 工具函数
 */
import classNames from "classnames";
/**
 * @description 导入 React 的 hooks
 */
import { useEffect, useRef } from "react";
/**
 * @description 导入 react-dnd 的 useDrop hook
 */
import { useDrop } from "react-dnd";
/**
 * @description 导入 useTodoListStore hook
 */
import { useTodoListStore } from "./store";

/**
 * @interface GapProps
 * @description Gap 组件的属性接口
 * @property {string} [id] - 可选的待办事项 ID
 */
interface GapProps {
	id?: string;
}

/**
 * @component Gap
 * @description 这是一个间隔组件，功能是作为拖拽目标在待办事项列表中插入新的待办事项
 */
export function Gap(props: GapProps) {
	/**
	 * @description 解构 props 获取待办事项 ID
	 */
	const { id } = props;

	/**
	 * @description 从 store 中获取添加待办事项的方法
	 */
	const addItem = useTodoListStore((state) => state.addItem);

	/**
	 * @description 创建 ref 用于拖拽
	 */
	const ref = useRef<HTMLDivElement>(null);

	/**
	 * @description 使用 useDrop hook 实现拖拽放置功能
	 */
	const [{ isOver }, drop] = useDrop(() => {
		return {
			accept: "new-item",
			drop() {
				addItem(
					{
						id: Math.random().toString().slice(2, 8),
						status: "todo",
						content: "待办事项",
					},
					id,
				);
			},
			collect(monitor) {
				return {
					isOver: monitor.isOver(),
				};
			},
		};
	});

	/**
	 * @description 组件挂载时设置拖拽放置
	 */
	useEffect(() => {
		drop(ref);
	}, []);

	/**
	 * @description 使用 classNames 合并类名
	 */
	const cs = classNames("h-10", isOver ? "bg-red-300" : "");

	return (
		/**
		 * @description 间隔容器
		 */
		<div ref={ref} className={cs}></div>
	);
}
