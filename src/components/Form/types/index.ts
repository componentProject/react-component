import type { CSSProperties, ReactNode } from "react";

/**
 * Form 组件的 props
 *
 * @property {string} className - 自定义 className
 * @property {CSSProperties} style - 自定义 style
 * @property {(values: Record<string, any>) => void} onFinish - 表单提交成功回调
 * @property {(errors: Record<string, any>) => void} onFinishFailed - 表单提交失败回调
 * @property {Record<string, any>} initialValues - 表单的初始值
 * @property {ReactNode} children - Form 组件的子元素
 */
export interface propsType extends React.HTMLAttributes<HTMLFormElement> {
	className?: string;
	style?: CSSProperties;
	onFinish?: (values: Record<string, any>) => void;
	onFinishFailed?: (errors: Record<string, any>) => void;
	initialValues?: Record<string, any>;
	children?: ReactNode;
}

/**
 * Form 组件的 ref api
 *
 * @property {(values: Record<string, any>) => void} getFieldsValue - 获取当前表单的所有值
 * @property {(values: Record<string, any>) => void} setFieldsValue - 设置当前表单的所有值
 */
export interface FormRefApi {
	getFieldsValue: () => Record<string, any>;
	setFieldsValue: (values: Record<string, any>) => void;
}
