/**
 * 导入Ant Design表单组件
 */
import { Form as AntdForm, DatePicker, Input } from "antd";
/**
 * 导入React相关依赖
 */
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo } from "react";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";
/**
 * 导入日期处理库
 */
import dayjs from "dayjs";

/**
 * 表单组件引用接口
 * 定义表单组件对外暴露的方法
 * @interface FormRef
 */
export interface FormRef {
	/** 提交表单方法 */
	submit: () => void;
}

/**
 * 表单组件（生产态）
 *
 * 用于预览模式下的表单组件，支持数据提交
 * 支持自定义表单项的类型，包括文本和日期控件
 * 通过ref提供submit方法进行表单提交
 *
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 子组件，通常是FormItem
 * @param {Function} props.onFinish - 表单提交回调
 * @param {Ref} ref - 组件引用
 * @returns {JSX.Element} 表单组件
 */
const Form: ForwardRefRenderFunction<FormRef, CommonComponentProps> = ({ children, onFinish }, ref) => {
	/**
	 * 创建Ant Design表单实例
	 */
	const [form] = AntdForm.useForm();

	/**
	 * 暴露方法给父组件
	 * 提供submit方法用于表单提交
	 */
	useImperativeHandle(ref, () => {
		return {
			submit: () => {
				form.submit();
			},
		};
	}, [form]);

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
				rules: item.props?.rules,
			};
		});
	}, [children]);

	/**
	 * 处理表单提交
	 * 转换日期值为字符串格式并调用onFinish回调
	 *
	 * @param {Object} values - 表单值对象
	 */
	async function save(values: any) {
		Object.keys(values).forEach((key) => {
			if (dayjs.isDayjs(values[key])) {
				values[key] = values[key].format("YYYY-MM-DD");
			}
		});

		onFinish(values);
	}

	/**
	 * 渲染表单组件
	 */
	return (
		<AntdForm name="form" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form} onFinish={save}>
			{formItems.map((item: any) => {
				return (
					<AntdForm.Item
						key={item.name}
						name={item.name}
						label={item.label}
						rules={
							item.rules === "required"
								? [
										{
											required: true,
											message: "不能为空",
										},
									]
								: []
						}
					>
						{item.type === "input" && <Input />}
						{item.type === "date" && <DatePicker />}
					</AntdForm.Item>
				);
			})}
		</AntdForm>
	);
};

export default forwardRef(Form);
