/**
 * 导入React钩子
 */
import { useMemo } from "react";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "../../stores/component-config";
/**
 * 导入物料项组件
 */
import { MaterialItem } from "../MaterialItem";

/**
 * 物料组件
 *
 * 用法: <Material />
 *
 * 显示所有可用的组件物料，用户可以从中拖拽组件到编辑区
 */
export function Material() {
	/**
	 * 从组件配置存储中获取组件配置
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 过滤并准备要显示的组件列表
	 * 排除名为'Page'的组件，因为它是容器而非可拖拽组件
	 */
	const components = useMemo(() => {
		return Object.values(componentConfig).filter((item) => item.name !== "Page");
	}, [componentConfig]);

	/**
	 * 渲染物料列表，为每个组件创建一个可拖拽的MaterialItem
	 */
	return (
		<div>
			{components.map((item, index) => {
				return <MaterialItem name={item.name} desc={item.desc} key={item.name + index} />;
			})}
		</div>
	);
}
