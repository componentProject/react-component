/**
 * 导入React Hooks
 */
import { useMemo } from "react";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "@/components/LowCodeEditor/stores/component-config";
/**
 * 导入物料项组件
 */
import { MaterialItem } from "@/components/LowCodeEditor/components/MaterialItem";

/**
 * 物料面板组件
 *
 * 显示所有可用的组件物料，用户可以从中拖拽组件到编辑区
 * 过滤掉Page组件，因为Page是根组件不需要在物料面板中显示
 *
 * @returns {JSX.Element} 物料面板
 */
export function Material() {
	/**
	 * 获取组件配置信息
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 过滤并转换组件配置为可显示的物料项列表
	 */
	const components = useMemo(() => {
		return Object.values(componentConfig).filter((item) => item.name !== "Page");
	}, [componentConfig]);

	/**
	 * 渲染物料面板
	 */
	return (
		<div>
			{/* 渲染物料项列表 */}
			{components.map((item, index) => {
				return <MaterialItem name={item.name} desc={item.desc} key={item.name + index} />;
			})}
		</div>
	);
}
