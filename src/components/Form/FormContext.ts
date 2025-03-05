import { createContext } from "react";

/**
 * FormContext 的 props 类型
 *
 * @property {Record<string, any>} [values] - 表单的值
 * @property {(key: string, value: any) => void} [onValueChange] - 表单值变化时的回调函数
 * @property {(values: Record<string, any>) => void} [setValues] - 设置表单的值
 * @property {(name: string, cb?: Function) => void} [validateRegister] - 注册表单验证函数
 */
export interface FormContextProps {
	values?: Record<string, any>;
	onValueChange?: (key: string, value: any) => void;
	setValues?: (values: Record<string, any>) => void;
	validateRegister?: (name: string, cb?: Function) => void;
}

/**
 * FormContext
 *
 * FormContext 是一个 React Context，用于在 React 组件树中传递表单相关的信息
 *
 * FormContext 的 props 类型是 FormContextProps
 */
export default createContext<FormContextProps>({});
