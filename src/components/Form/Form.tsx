/**
 * @file Form.tsx
 * @description 表单组件，用于包装表单
 */

/** 导入React相关依赖 */
import { useState, useRef, FormEvent, useImperativeHandle, forwardRef } from "react";
/** 导入类名工具 */
import classNames from "classnames";
/** 导入表单上下文 */
import FormContext from "./FormContext";

/** 导入类型定义 */
import type { propsType, FormRefApi } from "./types";

/**
 * @interface FormProps
 * @description 表单组件的属性接口
 * @property {string} [className] - 自定义类名
 * @property {React.CSSProperties} [style] - 自定义样式
 * @property {React.ReactNode} children - 表单子元素
 * @property {(values: Record<string, any>) => void} [onFinish] - 表单提交成功时的回调
 * @property {(errors: Record<string, any>) => void} [onFinishFailed] - 表单提交失败时的回调
 * @property {Record<string, any>} [initialValues] - 表单初始值
 */

/**
 * @component Form
 * @description 表单组件，用于包装表单，提供表单验证和提交功能
 * @param {FormProps} props - 组件属性
 * @param {React.RefObject<FormRefApi>} ref - 组件引用
 * @returns {JSX.Element} 表单组件
 */
const Form = forwardRef<FormRefApi, propsType>((props: propsType, ref) => {
	/** props */
	const { className, style, children, onFinish, onFinishFailed, initialValues, ...others } = props;

	/** 状态 */
	const [values, setValues] = useState<Record<string, any>>(initialValues || {});

	/** ref */
	useImperativeHandle(ref, () => {
		/** 对外暴露的api */
		return {
			/**
			 * 获取当前表单的值
			 * @returns
			 */
			getFieldsValue() {
				return values;
			},
			/**
			 * 设置当前表单的值
			 * @param fieldValues
			 */
			setFieldsValue(fieldValues) {
				setValues({ ...values, ...fieldValues });
			},
		};
	}, []);

	/** validators */
	const validatorMap = useRef(new Map<string, Function>());

	/** errors */
	const errors = useRef<Record<string, any>>({});

	/** 监听值的变化 */
	const onValueChange = (key: string, value: any) => {
		values[key] = value;
	};

	/** 提交表单 */
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		/** 遍历validators,并执行 */
		for (const [key, callbackFunc] of validatorMap.current) {
			if (typeof callbackFunc === "function") {
				errors.current[key] = callbackFunc();
			}
		}

		/** 获取所有的错误信息 */
		const errorList = Object.keys(errors.current)
			.map((key) => {
				return errors.current[key];
			})
			.filter(Boolean);

		/** 如果有错误信息,则执行onFinishFailed */
		if (errorList.length) {
			onFinishFailed?.(errors.current);
		} else {
			/** 如果没有错误信息,则执行onFinish */
			onFinish?.(values);
		}
	};

	/** 注册校验器 */
	const handleValidateRegister = (name: string, cb: Function = () => {}) => {
		validatorMap.current.set(name, cb);
	};

	/** classnames */
	const cls = classNames("ant-form", className);

	return (
		/** FormContext */
		<FormContext.Provider
			value={{
				/** 监听值的变化 */
				onValueChange,
				/** 获取当前表单的值 */
				values,
				/** 设置当前表单的值 */
				setValues: (v) => setValues(v),
				/** 注册校验器 */
				validateRegister: handleValidateRegister,
			}}
		>
			{/* 表单容器 */}
			<form {...others} className={cls} style={style} onSubmit={handleSubmit}>
				{/* 表单内容 */}
				{children}
			</form>
		</FormContext.Provider>
	);
});

export default Form;
