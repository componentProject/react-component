/**
 * 导入Ant Design树组件
 */
import { Tree } from "antd";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "../../stores/components";

/**
 * 大纲组件
 *
 * 用法: <Outline />
 *
 * 以树形结构显示当前页面的组件层次，允许用户通过点击选择组件
 *
 * @returns {JSX.Element} 渲染的大纲树
 */
export function Outline() {
	/**
	 * 从组件状态存储中获取组件列表和选中组件设置函数
	 */
	const { components, setCurComponentId } = useComponetsStore();

	/**
	 * 渲染树形组件
	 * 配置字段名映射、显示样式和选择事件处理
	 */
	return (
		<Tree
			fieldNames={{ title: "desc", key: "id" }}
			treeData={components as any}
			showLine
			defaultExpandAll
			onSelect={([selectedKey]) => {
				setCurComponentId(selectedKey as number);
			}}
		/>
	);
}
