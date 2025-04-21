/**
 * 导入Ant Design分段控制器组件
 */
import { Segmented } from "antd";
/**
 * 导入React钩子
 */
import { useState } from "react";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "../../stores/components";
/**
 * 导入组件属性设置面板
 */
import { ComponentAttr } from "./ComponentAttr";
/**
 * 导入组件事件设置面板
 */
import { ComponentEvent } from "./ComponentEvent";
/**
 * 导入组件样式设置面板
 */
import { ComponentStyle } from "./ComponentStyle";

/**
 * 设置面板组件
 *
 * 用法: <Setting />
 *
 * 提供组件属性、样式和事件的设置界面，通过分段控制器切换不同设置面板
 *
 * @returns {JSX.Element|null} 渲染的设置面板或null（无选中组件时）
 */
export function Setting() {
	/**
	 * 从组件状态存储中获取当前选中的组件ID
	 */
	const { curComponentId } = useComponetsStore();

	/**
	 * 当前选中的设置面板类型
	 */
	const [key, setKey] = useState<string>("属性");

	/**
	 * 如果没有选中组件，则不显示设置面板
	 */
	if (!curComponentId) return null;

	/**
	 * 渲染设置面板
	 * 包含分段控制器和当前选中的设置面板内容
	 */
	return (
		<div>
			<Segmented value={key} onChange={setKey} block options={["属性", "样式", "事件"]} />
			<div className="pt-[20px]">
				{key === "属性" && <ComponentAttr />}
				{key === "样式" && <ComponentStyle />}
				{key === "事件" && <ComponentEvent />}
			</div>
		</div>
	);
}
