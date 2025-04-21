/**
 * 导入React DnD拖拽功能
 */
import { useDrop } from "react-dnd";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "@/components/LowCodeEditor/stores/component-config";
/**
 * 导入组件状态管理和组件查询工具
 */
import { getComponentById, useComponetsStore } from "@/components/LowCodeEditor/stores/components";

/**
 * 拖拽项类型接口
 * @interface ItemType
 */
export interface ItemType {
	/** 组件类型 */
	type: string;
	/** 拖拽类型：move-移动现有组件，add-添加新组件 */
	dragType?: "move" | "add";
	/** 组件ID */
	id: number;
}

/**
 * 物料拖拽自定义Hook
 *
 * 处理物料面板组件的拖拽放置逻辑，支持添加新组件和移动已有组件
 *
 * @param {string[]} accept - 可接受的组件类型数组
 * @param {number} id - 目标组件ID（拖拽放置的目标容器）
 * @returns {Object} 拖拽状态和引用对象
 */
export function useMaterailDrop(accept: string[], id: number) {
	/**
	 * 从组件状态存储中获取组件操作方法
	 */
	const { addComponent, deleteComponent, components } = useComponetsStore();
	/**
	 * 获取组件配置信息
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 配置拖拽放置功能
	 */
	const [{ canDrop }, drop] = useDrop(() => ({
		accept,
		drop: (item: ItemType, monitor) => {
			const didDrop = monitor.didDrop();
			if (didDrop) {
				return;
			}

			if (item.dragType === "move") {
				// 移动已有组件
				const component = getComponentById(item.id, components)!;

				deleteComponent(item.id);

				addComponent(component, id);
			} else {
				// 添加新组件
				const config = componentConfig[item.type];

				addComponent(
					{
						id: new Date().getTime(),
						name: item.type,
						desc: config.desc,
						props: config.defaultProps,
					},
					id,
				);
			}
		},
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
		}),
	}));

	return { canDrop, drop };
}
