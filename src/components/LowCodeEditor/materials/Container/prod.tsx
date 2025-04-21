/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";

/**
 * 容器组件（生产态）
 *
 * 用于预览模式下的容器组件，作为其他组件的容器
 * 没有拖拽和放置功能，只提供样式和布局
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 容器组件
 */
const Container = ({ id, children, styles }: CommonComponentProps) => {
	/**
	 * 渲染容器组件
	 */
	return (
		<div style={styles} className={`p-[20px]`}>
			{children}
		</div>
	);
};

export default Container;
