/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";

/**
 * 页面组件（生产态）
 *
 * 作为预览模式下的根容器，渲染整个页面内容
 * 没有拖拽和放置功能，仅作为内容的呈现容器
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 页面组件
 */
function Page({ id, name, children, styles }: CommonComponentProps) {
	/**
	 * 渲染页面组件
	 */
	return (
		<div className="p-[20px]" style={{ ...styles }}>
			{children}
		</div>
	);
}

export default Page;
