import { useState, useRef, FormEvent, useImperativeHandle, forwardRef } from "react";
import classNames from "classnames";
import FormContext from "./FormContext";

import type { propsType, FormRefApi } from "./types";

/**
 * Form组件，用于包装表单
 * @param props
 * @param ref
 * @returns
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
			{/*form*/}
			<form {...others} className={cls} style={style} onSubmit={handleSubmit}>
				{children}
			</form>
		</FormContext.Provider>
	);
});

export default Form;
