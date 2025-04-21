/**
 * 导入Ant Design组件
 */
import { Segmented } from "antd";
/**
 * 导入React Hooks
 */
import { useState } from "react";
/**
 * 导入物料面板组件
 */
import { Material } from "@/components/LowCodeEditor/components/Material";
/**
 * 导入大纲组件
 */
import { Outline } from "@/components/LowCodeEditor/components/Outline";
/**
 * 导入源码组件
 */
import { Source } from "@/components/LowCodeEditor/components/Source";

/**
 * 物料包装组件
 *
 * 提供左侧面板的导航和内容管理，包含物料、大纲和源码三个Tab页面
 * 用户可以通过切换不同的Tab来查看和使用不同的功能
 *
 * @returns {JSX.Element} 物料包装组件
 */
export function MaterialWrapper() {
	/**
	 * 当前选中的Tab页签
	 */
	const [key, setKey] = useState<string>("物料");

	/**
	 * 渲染物料包装组件
	 */
	return (
		<div>
			{/* 顶部分段控件，用于切换不同Tab */}
			<Segmented value={key} onChange={setKey} block options={["物料", "大纲", "源码"]} />
			{/* 内容区域 */}
			<div className="pt-[20px] h-[calc(100vh-60px-30px-20px)]">
				{/* 根据选中的Tab渲染不同的内容 */}
				{key === "物料" && <Material />}
				{key === "大纲" && <Outline />}
				{key === "源码" && <Source />}
			</div>
		</div>
	);
}
