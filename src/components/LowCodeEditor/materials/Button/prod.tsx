/**
 * 导入Ant Design按钮组件
 */
import { Button as AntdButton } from "antd";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";

/**
 * 按钮组件（生产态）
 *
 * 用于预览模式下的按钮组件，支持所有Ant Design按钮的属性和事件
 * 不含拖拽功能，可响应配置的事件
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 按钮组件
 */
const Button = ({ id, type, text, styles, ...props }: CommonComponentProps) => {
	/**
	 * 渲染按钮组件
	 */
	return (
		<AntdButton type={type} style={styles} {...props}>
			{text}
		</AntdButton>
	);
};

export default Button;
