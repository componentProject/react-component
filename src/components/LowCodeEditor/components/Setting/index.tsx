/**
 * 导入Ant Design组件
 */
import { Segmented } from "antd";
/**
 * 导入React Hooks
 */
import { useState } from "react";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "@/components/LowCodeEditor/stores/components";
/**
 * 导入组件属性编辑面板
 */
import { ComponentAttr } from "@/components/LowCodeEditor/components/Setting/ComponentAttr";
/**
 * 导入组件事件编辑面板
 */
import { ComponentEvent } from "@/components/LowCodeEditor/components/Setting/ComponentEvent";
/**
 * 导入组件样式编辑面板
 */
import { ComponentStyle } from "@/components/LowCodeEditor/components/Setting/ComponentStyle";

/**
 * 设置面板组件
 *
 * 提供组件属性、样式和事件的配置界面，是编辑器的右侧面板
 * 用户可以通过此组件对选中的组件进行各种设置
 *
 * @returns {JSX.Element | null} 设置面板组件或null（当没有选中组件时）
 */
export function Setting() {
	/**
	 * 获取当前选中的组件ID
	 */
	const { curComponentId } = useComponetsStore();

	/**
	 * 当前选中的设置Tab页签
	 */
	const [key, setKey] = useState<string>("属性");

	/**
	 * 当没有选中组件时不显示设置面板
	 */
	if (!curComponentId) return null;

	/**
	 * 渲染设置面板
	 */
	return (
		<div>
			{/* 顶部分段控件，用于切换不同的设置Tab */}
			<Segmented value={key} onChange={setKey} block options={["属性", "样式", "事件"]} />
			{/* 设置内容区域 */}
			<div className="pt-[20px]">
				{/* 根据选中的Tab渲染不同的设置内容 */}
				{key === "属性" && <ComponentAttr />}
				{key === "样式" && <ComponentStyle />}
				{key === "事件" && <ComponentEvent />}
			</div>
		</div>
	);
}
