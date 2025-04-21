/**
 * 导入自定义物料拖拽Hook
 */
import { useMaterailDrop } from "@/components/LowCodeEditor/hooks/useMaterailDrop";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";

/**
 * 模态框组件（开发态）
 *
 * 作为编辑器中的模态框容器，可以放置其他组件
 * 提供了拖拽放置功能，展示为一个带标题的容器
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 模态框组件
 */
function Modal({ id, children, title, styles }: CommonComponentProps) {
	/**
	 * 配置拖拽放置功能
	 * 接受Button、Container、Table和Form类型的组件
	 */
	const { canDrop, drop } = useMaterailDrop(["Button", "Container", "Table", "Form"], id);

	/**
	 * 渲染模态框组件
	 */
	return (
		<div
			ref={drop}
			style={styles}
			data-component-id={id}
			className={`min-h-[100px] p-[20px] ${canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"}`}
		>
			{/* 模态框标题 */}
			<h4>{title}</h4>
			{/* 模态框内容区域 */}
			<div>{children}</div>
		</div>
	);
}

export default Modal;
