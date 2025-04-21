/**
 * 导入所需组件和钩子
 * - Segmented: 用于创建分段控制器组件
 * - useState: React钩子，用于管理组件状态
 * - Material, Outline, Source: 子组件，分别展示物料、大纲和源码
 */
import { Segmented } from "antd";
import { useState } from "react";
import { Material } from "../Material";
import { Outline } from "../Outline";
import { Source } from "../Source";

/**
 * MaterialWrapper组件
 *
 * 提供一个分段控制的界面，允许用户在物料、大纲和源码三个视图之间切换
 * 根据用户选择的视图类型显示对应的组件
 *
 * 用法: <MaterialWrapper />
 *
 * @returns {JSX.Element} 包含分段控制器和当前选中视图的组件
 */
export function MaterialWrapper() {
	/**
	 * 当前选中的视图类型状态
	 * 可能的值: '物料', '大纲', '源码'
	 * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
	 */
	const [key, setKey] = useState<string>("物料");

	/**
	 * 渲染分段控制器和当前选中的内容视图
	 */
	return (
		<div>
			{/* 分段控制器 - 切换不同视图 */}
			<Segmented value={key} onChange={setKey} block options={["物料", "大纲", "源码"]} />
			{/* 内容区域 - 显示当前选中的视图组件 */}
			<div className="pt-[20px] h-[calc(100vh-60px-30px-20px)]">
				{/* 物料视图 - 显示可用组件 */}
				{key === "物料" && <Material />}
				{/* 大纲视图 - 显示组件树结构 */}
				{key === "大纲" && <Outline />}
				{/* 源码视图 - 显示JSON格式的组件数据 */}
				{key === "源码" && <Source />}
			</div>
		</div>
	);
}
