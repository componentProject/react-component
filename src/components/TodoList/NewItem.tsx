/**
 * @file NewItem.tsx
 * @description 新建待办事项组件
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
 * @description 导入 react-dnd 的 useDrag hook
 */
import { useDrag } from "react-dnd";

/**
 * @interface NewItemProps
 * @description NewItem 组件的属性接口
 * @property {string | string[]} [className] - 可选的类名
 */
interface NewItemProps {
	className?: string | string[];
}

/**
 * @component NewItem
 * @description 这是一个新建待办事项组件，功能是作为拖拽源创建新的待办事项
 */
export const NewItem: FC<NewItemProps> = (props) => {
	/**
	 * @description 创建 ref 用于拖拽
	 */
	const ref = useRef<HTMLDivElement>(null);

	/**
	 * @description 使用 useDrag hook 实现拖拽功能
	 */
	const [{ dragging }, drag] = useDrag({
		type: "new-item",
		item: {},
		collect(monitor) {
			return {
				dragging: monitor.isDragging(),
			};
		},
	});

	/**
	 * @description 组件挂载时设置拖拽
	 */
	useEffect(() => {
		drag(ref);
	}, []);

	/**
	 * @description 使用 classNames 合并类名
	 */
	const cs = classNames(
		"h-100 border-2 border-black",
		"leading-100 text-center text-2xl",
		"bg-green-300",
		"cursor-move select-none",
		dragging ? "border-dashed bg-white" : "",
		props.className,
	);

	return (
		/**
		 * @description 新建待办事项容器
		 */
		<div ref={ref} className={cs}>
			新的待办事项
		</div>
	);
};
