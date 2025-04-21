/**
 * 导入Ant Design按钮组件
 */
import { Button as AntdButton } from "antd";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";
/**
 * 导入React DnD拖拽功能
 */
import { useDrag } from "react-dnd";

/**
 * 按钮组件（开发态）
 *
 * 在编辑器中可拖拽的按钮组件，支持不同类型和自定义文本
 * 可以通过点击选中并拖动到页面的其他位置
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 按钮组件
 */
const Button = ({ id, type, text, styles }: CommonComponentProps) => {
	/**
	 * 配置拖拽功能
	 * 使组件可在编辑器中移动
	 */
	const [_, drag] = useDrag({
		type: "Button",
		item: {
			type: "Button",
			dragType: "move",
			id: id,
		},
	});

	/**
	 * 渲染按钮组件
	 */
	return (
		<AntdButton ref={drag} data-component-id={id} type={type} style={styles}>
			{text}
		</AntdButton>
	);
};

export default Button;
