/**
 * @file Item.tsx
 * @description 待办事项项组件
 */

/**
 * @description 导入 classNames 工具函数
 */
import classNames from "classnames";
/**
 * @description 导入 React 的 hooks
 */
import { useEffect, useRef, useState } from "react";
/**
 * @description 导入 react-dnd 的 useDrag hook
 */
import { useDrag } from "react-dnd";
/**
 * @description 导入 ListItem 类型和 useTodoListStore hook
 */
import { ListItem, useTodoListStore } from "./store";

/**
 * @interface ItemProps
 * @description Item 组件的属性接口
 * @property {ListItem} data - 待办事项数据
 */
interface ItemProps {
	data: ListItem;
}

/**
 * @component Item
 * @description 这是一个待办事项项组件，功能是展示单个待办事项，支持编辑和拖拽
 */
export function Item(props: ItemProps) {
	/**
	 * @description 解构 props 获取待办事项数据
	 */
	const { data } = props;

	/**
	 * @description 从 store 中获取更新待办事项的方法
	 */
	const updateItem = useTodoListStore((state) => state.updateItem);

	/**
	 * @description 创建 ref 用于拖拽
	 */
	const ref = useRef<HTMLDivElement>(null);

	/**
	 * @description 编辑状态
	 */
	const [editing, setEditing] = useState(false);

	/**
	 * @description 编辑内容
	 */
	const [editingContent, setEditingContent] = useState(data.content);

	/**
	 * @description 使用 useDrag hook 实现拖拽功能
	 */
	const [{ dragging }, drag] = useDrag({
		type: "list-item",
		item: {
			id: data.id,
		},
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

	return (
		/**
		 * @description 待办事项项容器
		 */
		<div
			ref={ref}
			className={classNames(
				"h-100 border-2 border-black bg-blue-300 p-10",
				"flex justify-start items-center",
				"text-xl tracking-wide",
				dragging ? "bg-white border-dashed" : "",
			)}
			onDoubleClick={() => {
				setEditing(true);
			}}
		>
			/**
			 * @description 复选框，用于标记待办事项状态
			 */
			<input
				type="checkbox"
				className="w-40 h-40 mr-10"
				checked={data.status === "done" ? true : false}
				onChange={(e) => {
					updateItem({
						...data,
						status: e.target.checked ? "done" : "todo",
					});
				}}
			/>
			<p>
				{editing ? (
					/**
					 * @description 编辑状态下的输入框
					 */
					<input
						value={editingContent}
						onChange={(e) => {
							setEditingContent(e.target.value);
						}}
						onBlur={() => {
							setEditing(false);
							updateItem({
								...data,
								content: editingContent,
							});
						}}
					/>
				) : (
					data.content
				)}
			</p>
		</div>
	);
}
