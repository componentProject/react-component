/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";
/**
 * 导入自定义物料拖拽Hook
 */
import { useMaterailDrop } from "@/components/LowCodeEditor/hooks/useMaterailDrop";

/**
 * 页面组件（开发态）
 *
 * 作为编辑器中的根容器，可以放置其他组件
 * 提供了拖拽放置功能，作为组件树的顶层容器
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 页面组件
 */
function Page({ id, name, children, styles }: CommonComponentProps) {
	/**
	 * 配置拖拽放置功能
	 * 接受Button、Container、Modal、Table和Form类型的组件
	 */
	const { canDrop, drop } = useMaterailDrop(["Button", "Container", "Modal", "Table", "Form"], id);

	/**
	 * 渲染页面组件
	 */
	return (
		<div
			data-component-id={id}
			ref={drop}
			className="p-[20px] h-[100%] box-border"
			style={{ ...styles, border: canDrop ? "2px solid blue" : "none" }}
		>
			{children}
		</div>
	);
}

export default Page;
