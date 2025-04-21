/**
 * 导入Ant Design Tree组件
 */
import { Tree } from "antd";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "@/components/LowCodeEditor/stores/components";

/**
 * 大纲组件
 *
 * 以树形结构显示当前页面中的所有组件，便于查看组件层级结构
 * 用户可以通过点击节点来选中对应的组件
 *
 * @returns {JSX.Element} 大纲树形组件
 */
export function Outline() {
	/**
	 * 获取组件树和选中组件的方法
	 */
	const { components, setCurComponentId } = useComponetsStore();

	/**
	 * 渲染大纲树
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
