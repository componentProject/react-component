/**
 * @file GarbageBin.tsx
 * @description 垃圾箱组件
 */

/**
 * @description 导入 classNames 工具函数
 */
import classNames from "classnames";
/**
 * @description 导入 React 的 FC 类型和 hooks
 */
import { FC, useEffect, useRef } from "react";
/**
 * @description 导入 react-dnd 的 useDrop hook
 */
import { useDrop } from "react-dnd";
/**
 * @description 导入 useTodoListStore hook
 */
import { useTodoListStore } from "./store";

/**
 * @interface GarbaseProps
 * @description GarbageBin 组件的属性接口
 * @property {string | string[]} [className] - 可选的类名
 */
interface GarbaseProps {
	className?: string | string[];
}

/**
 * @component GarbageBin
 * @description 这是一个垃圾箱组件，功能是作为拖拽目标删除待办事项
 */
export const GarbageBin: FC<GarbaseProps> = (props) => {
	/**
	 * @description 从 store 中获取删除待办事项的方法
	 */
	const deleteItem = useTodoListStore((state) => state.deleteItem);

	/**
	 * @description 创建 ref 用于拖拽
	 */
	const ref = useRef<HTMLDivElement>(null);

	/**
	 * @description 使用 useDrop hook 实现拖拽放置功能
	 */
	const [{ isOver }, drop] = useDrop(() => {
		return {
			accept: "list-item",
			drop(item: { id: string }) {
				deleteItem(item.id);
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
	const cs = classNames(
		"h-200 border-2 border-black",
		"bg-orange-300",
		"leading-200 text-center text-2xl",
		"cursor-move select-none",
		isOver ? "bg-yellow-400 border-dashed" : "",
		props.className,
	);

	return (
		/**
		 * @description 垃圾箱容器
		 */
		<div ref={ref} className={cs}>
			垃圾箱
		</div>
	);
};
