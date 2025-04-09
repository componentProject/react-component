/**
 * @file List.tsx
 * @description 待办事项列表组件
 */

/**
 * @description 导入 classNames 工具函数
 */
import classNames from "classnames";
/**
 * @description 导入 React 的 FC 类型
 */
import { FC } from "react";
/**
 * @description 导入 Gap 组件
 */
import { Gap } from "./Gap";
/**
 * @description 导入 Item 组件
 */
import { Item } from "./Item";
/**
 * @description 导入 useTodoListStore hook
 */
import { useTodoListStore } from "./store";
/**
 * @description 导入 react-spring 的动画相关组件和 hooks
 */
import { animated, useTransition } from "@react-spring/web";

/**
 * @interface ListProps
 * @description List 组件的属性接口
 * @property {string | string[]} [className] - 可选的类名
 */
interface ListProps {
	className?: string | string[];
}

/**
 * @component List
 * @description 这是一个待办事项列表组件，功能是展示待办事项列表，支持动画效果
 */
export const List: FC<ListProps> = (props) => {
	/**
	 * @description 从 store 中获取待办事项列表
	 */
	const list = useTodoListStore((state) => state.list);

	/**
	 * @description 使用 classNames 合并类名
	 */
	const cs = classNames("h-full p-10", props.className);

	/**
	 * @description 使用 useTransition 创建列表项的动画效果
	 */
	const transitions = useTransition(list, {
		from: { transform: "translate3d(100%,0,0)", opacity: 0 },
		enter: { transform: "translate3d(0%,0,0)", opacity: 1 },
		leave: { transform: "translate3d(-100%,0,0)", opacity: 0 },
		keys: list.map((item) => item.id),
	});

	return (
		/**
		 * @description 列表容器
		 */
		<div className={cs}>
			{list.length
				? transitions((style, item) => {
						return (
							/**
							 * @description 使用 animated.div 包装每个列表项，实现动画效果
							 */
							<animated.div style={style}>
								<Gap id={item.id} />
								<Item data={item} />
							</animated.div>
						);
					})
				: "暂无待办事项"}
			<Gap />
		</div>
	);
};
