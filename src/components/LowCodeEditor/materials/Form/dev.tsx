/**
 * 导入Ant Design表单组件和输入框组件
 */
import { Form as AntdForm, Input } from "antd";
/**
 * 导入React相关依赖
 */
import React, { useEffect, useMemo, useRef } from "react";
/**
 * 导入自定义物料拖拽Hook
 */
import { useMaterailDrop } from "@/components/LowCodeEditor/hooks/useMaterailDrop";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";
/**
 * 导入React DnD拖拽功能
 */
import { useDrag } from "react-dnd";

/**
 * 表单组件（开发态）
 *
 * 在编辑器中可拖拽的表单组件，可以接受FormItem作为子组件
 * 支持被拖拽移动，也可以作为表单项的放置目标
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 表单组件
 */
function Form({ id, name, children, onFinish }: CommonComponentProps) {
	/**
	 * 创建Ant Design表单实例
	 */
	const [form] = AntdForm.useForm();

	/**
	 * 配置拖拽放置功能
	 * 只接受FormItem类型的组件
	 */
	const { canDrop, drop } = useMaterailDrop(["FormItem"], id);

	/**
	 * 表单容器DOM引用
	 */
	const divRef = useRef<HTMLDivElement>(null);

	/**
	 * 配置拖拽功能
	 * 使表单可在编辑器中移动
	 */
	const [_, drag] = useDrag({
		type: name,
		item: {
			type: name,
			dragType: "move",
			id: id,
		},
	});

	/**
	 * 应用拖拽和放置功能到表单容器
	 */
	useEffect(() => {
		drop(divRef);
		drag(divRef);
	}, []);

	/**
	 * 处理表单项数据
	 * 从子组件中提取表单项的属性
	 */
	const formItems = useMemo(() => {
		return React.Children.map(children, (item: any) => {
			return {
				label: item.props?.label,
				name: item.props?.name,
				type: item.props?.type,
				id: item.props?.id,
			};
		});
	}, [children]);

	/**
	 * 渲染表单组件
	 */
	return (
		<div
			className={`w-[100%] p-[20px] min-h-[100px] ${canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"}`}
			ref={divRef}
			data-component-id={id}
		>
			<AntdForm
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 18 }}
				form={form}
				onFinish={(values) => {
					onFinish?.(values);
				}}
			>
				{formItems.map((item: any) => {
					return (
						<AntdForm.Item key={item.name} data-component-id={item.id} name={item.name} label={item.label}>
							<Input style={{ pointerEvents: "none" }} />
						</AntdForm.Item>
					);
				})}
			</AntdForm>
		</div>
	);
}

export default Form;
