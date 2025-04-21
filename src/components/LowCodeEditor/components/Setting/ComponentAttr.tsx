/**
 * 导入Ant Design表单组件
 */
import { Form, Input, Select } from "antd";
/**
 * 导入React Hook
 */
import { useEffect } from "react";
/**
 * 导入组件配置类型和存储
 */
import { ComponentConfig, ComponentSetter, useComponentConfigStore } from "@/components/LowCodeEditor/stores/component-config";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "@/components/LowCodeEditor/stores/components";

/**
 * 组件属性编辑面板
 *
 * 提供组件基本属性的编辑功能，根据组件类型动态生成表单项
 * 用户可以通过此组件修改选中组件的属性
 *
 * @returns {JSX.Element | null} 组件属性编辑表单或null（当没有选中组件时）
 */
export function ComponentAttr() {
	/**
	 * 创建表单实例
	 */
	const [form] = Form.useForm();

	/**
	 * 获取当前选中组件和更新属性的方法
	 */
	const { curComponentId, curComponent, updateComponentProps } = useComponetsStore();
	/**
	 * 获取组件配置信息
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 当选中组件变化时，更新表单值
	 */
	useEffect(() => {
		const data = form.getFieldsValue();
		form.setFieldsValue({ ...data, ...curComponent?.props });
	}, [curComponent]);

	/**
	 * 当没有选中组件时不显示属性面板
	 */
	if (!curComponentId || !curComponent) return null;

	/**
	 * 根据配置项类型渲染对应的表单控件
	 *
	 * @param {ComponentSetter} setting - 配置项设置
	 * @returns {JSX.Element} 表单控件
	 */
	function renderFormElememt(setting: ComponentSetter) {
		const { type, options } = setting;

		if (type === "select") {
			return <Select options={options} />;
		} else if (type === "input") {
			return <Input />;
		}
	}

	/**
	 * 处理表单值变化
	 * 当表单项值变化时更新组件属性
	 *
	 * @param {ComponentConfig} changeValues - 变化的表单值
	 */
	function valueChange(changeValues: ComponentConfig) {
		if (curComponentId) {
			updateComponentProps(curComponentId, changeValues);
		}
	}

	/**
	 * 渲染属性编辑表单
	 */
	return (
		<Form form={form} onValuesChange={valueChange} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
			{/* 组件ID显示（只读） */}
			<Form.Item label="组件id">
				<Input value={curComponent.id} disabled />
			</Form.Item>
			{/* 组件名称显示（只读） */}
			<Form.Item label="组件名称">
				<Input value={curComponent.name} disabled />
			</Form.Item>
			{/* 组件描述显示（只读） */}
			<Form.Item label="组件描述">
				<Input value={curComponent.desc} disabled />
			</Form.Item>
			{/* 根据组件类型动态生成可编辑的表单项 */}
			{componentConfig[curComponent.name]?.setter?.map((setter) => (
				<Form.Item key={setter.name} name={setter.name} label={setter.label}>
					{renderFormElememt(setter)}
				</Form.Item>
			))}
		</Form>
	);
}
