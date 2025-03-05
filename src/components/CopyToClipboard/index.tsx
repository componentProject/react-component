import { Children, cloneElement } from "react";
import copy from "copy-to-clipboard";
import type { FC, PropsWithChildren } from "react";
import type { propsType } from "./types";
/**
 * 点击时复制传入的text到剪切板,
 *
 * 通过copy-to-clipboard实现
 *
 *  @param props - 组件的props
 *
 *  @param props.text - 需要复制到剪切板的文本
 *
 *  @param props.onCopy - 复制完成后的回调函数
 *
 *  @param props.debug - 是否在控制台中打印调试信息
 *
 *  @param props.message - 复制完成后的提示信息
 *
 *  @param props.format - 需要复制的格式
 */
const CopyToClipboard: FC<PropsWithChildren<propsType>> = (props) => {
	const {
		text = "", // 需要复制到剪切板的文本
		onCopy, // 复制完成后的回调函数
		debug, // 是否在控制台中打印调试信息
		message, // 复制完成后的提示信息
		format, // 需要复制的格式
		children, // 传入的子元素
	} = props;

	const elem = Children.only(children);

	/**
	 * 事件处理函数,
	 *
	 *  会将传入的text复制到剪切板,
	 *  如果onCopy存在,则会将text和复制结果传递给onCopy
	 *  如果elem存在onClick事件处理函数,则会执行elem的onClick事件处理函数
	 *
	 *  @param {MouseEvent} event - 事件对象
	 */
	function onClick(event: MouseEvent) {
		const elem = Children.only(children);

		const result = copy(text, {
			debug,
			message,
			format,
		});

		if (onCopy) {
			onCopy(text, result);
		}

		if (typeof elem?.props?.onClick === "function") {
			elem.props.onClick(event);
		}
	}

	/**
	 *  cloneElement的props中添加onClick事件处理函数,
	 *  onClick事件处理函数会将传入的text复制到剪切板,
	 *  并执行elem的onClick事件处理函数
	 */
	return cloneElement(elem!, { onClick });
};

export default CopyToClipboard;
