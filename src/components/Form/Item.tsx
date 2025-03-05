import React, {
	/** ReactNode是React中的一种类型，表示一个 React 元素 */
	ReactNode,
	/** CSSProperties是React中的一种类型，表示CSS样式对象 */
	type CSSProperties,
	/** useState是React中的一个hooks，用于在函数组件中添加state */
	useState,
	/** useContext是React中的一个hooks，用于在函数组件中使用Context */
	useContext,
	/** type ReactElement = React.ReactElement<any, any> */
	type ReactElement,
	/** useEffect是React中的一个hooks，用于在函数组件中处理副作用 */
	useEffect,
	/** type ChangeEvent<T = Element> = Event & { target: T } */
	type ChangeEvent,
} from "react";
import classNames from "classnames";
import Schema from "async-validator";

import FormContext from "./FormContext";

/** Item组件的属性类型定义 */
export interface ItemProps {
	/** className是Item组件的可选属性，用于设置Item的样式 */
	className?: string;
	/** style是Item组件的可选属性，用于设置Item的样式 */
	style?: CSSProperties;
	/** label是Item组件的可选属性，用于设置Item的标签 */
	label?: ReactNode;
	/** name是Item组件的可选属性，用于设置Item的name */
	name?: string;
	/** valuePropName是Item组件的可选属性，用于设置Item的值的props名 */
	valuePropName?: string;
	/** rules是Item组件的可选属性，用于设置Item的验证规则 */
	rules?: Array<Record<string, any>>;
	/** children是Item组件的可选属性，用于设置Item的子组件 */
	children?: ReactElement;
}

/** 从事件中获取输入值的帮助函数 */
const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
	const { target } = e;
	if (target.type === "checkbox") {
		/** 如果是复选框，返回checked状态 */
		return target.checked;
	} else if (target.type === "radio") {
		/** 如果是单选框，返回选中的值 */
		return target.value;
	}

	/** 默认返回输入框的值 */
	return target.value;
};

/** Item组件定义 */
const Item = (props: ItemProps) => {
	const {
		/** className是Item组件的可选属性，用于设置Item的样式 */
		className,
		/** label是Item组件的可选属性，用于设置Item的标签 */
		label,
		/** children是Item组件的可选属性，用于设置Item的子组件 */
		children,
		/** style是Item组件的可选属性，用于设置Item的样式 */
		style,
		/** name是Item组件的可选属性，用于设置Item的name */
		name = "",
		/** valuePropName是Item组件的可选属性，用于设置Item的值的props名 */
		valuePropName,
		/** rules是Item组件的可选属性，用于设置Item的验证规则 */
		rules,
	} = props;

	/** 组件内部状态：值和错误信息 */
	const [value, setValue] = useState<string | number | boolean>("");
	const [error, setError] = useState("");

	/** 从FormContext中获取上下文方法 */
	const { onValueChange, values, validateRegister } = useContext(FormContext);

	/**
	 * useEffect Hook
	 * 该Hook用于在组件mount/unmount时执行某些操作
	 * 在这里，我们使用useEffect来监听values的变化
	 * 并在name存在且与当前值不同时，更新内部状态值
	 */
	useEffect(() => {
		/** 当name属性存在且与当前值不同时，更新内部状态值 */
		if (name && value !== values?.[name]) {
			setValue(values?.[name]);
		}
	}, [values, values?.[name]]);

	/**
	 * 验证输入值的函数
	 * 该函数将在onValueChange时调用
	 * 并将验证结果设置到error状态中
	 */
	const handleValidate = (value: any) => {
		let errorMsg: any = null;
		if (Array.isArray(rules) && rules.length) {
			/** 创建异步验证器Schema实例 */
			const validator = new Schema({
				[name]: rules.map((rule) => {
					return {
						type: "string",
						...rule,
					};
				}),
			});

			validator
				.validate({ [name]: value }, (errors) => {
					/** 验证后回调函数 */
					if (errors) {
						if (errors?.length) {
							/** 如果有错误信息，设置到error状态中 */
							setError(errors[0].message!);
							errorMsg = errors[0].message;
						}
					} else {
						/** 如果没有错误信息，清空error状态 */
						setError("");
						errorMsg = null;
					}
				})
				.then((r) => console.log(r));
		}

		return errorMsg;
	};

	/**
	 * useEffect Hook
	 * 该Hook用于在组件mount/unmount时执行某些操作
	 * 在这里，我们使用useEffect来注册验证函数
	 */
	useEffect(() => {
		validateRegister?.(name!, () => handleValidate(value));
	}, [value]);
	if (!name) {
		return children;
	}
	const propsName: Record<string, any> = {};
	if (valuePropName) {
		propsName[valuePropName] = value;
	} else {
		propsName.value = value;
	}

	const childEle =
		React.Children.toArray(children).length > 1
			? children
			: React.cloneElement(children!, {
					...propsName,
					onChange: (e: ChangeEvent<HTMLInputElement>) => {
						const value = getValueFromEvent(e);
						setValue(value);
						onValueChange?.(name, value);

						handleValidate(value);
					},
				});

	const cls = classNames("ant-form-item", className);

	return (
		<div className={cls} style={style}>
			<div>{label && <label>{label}</label>}</div>
			<div>
				{childEle}
				{error && <div style={{ color: "red" }}>{error}</div>}
			</div>
		</div>
	);
};

export default Item;
