/**
 * @file index.tsx
 * @description 复制到剪贴板组件
 */

/** 导入React相关依赖 */
import { Children, cloneElement } from "react";
/** 导入复制到剪贴板工具 */
import copy from "copy-to-clipboard";
/** 导入类型定义 */
import type { FC, PropsWithChildren } from "react";
/** 导入属性类型 */
import type { propsType } from "./types";

/**
 * @component CopyToClipboard
 * @description 点击时复制文本到剪贴板的组件
 * @param {PropsWithChildren<propsType>} props - 组件属性
 * @property {string} [text] - 需要复制的文本
 * @property {(text: string, result: boolean) => void} [onCopy] - 复制完成后的回调函数
 * @property {boolean} [debug] - 是否在控制台打印调试信息
 * @property {string} [message] - 复制完成后的提示信息
 * @property {string} [format] - 需要复制的格式
 * @property {React.ReactNode} children - 子元素
 */
const CopyToClipboard: FC<PropsWithChildren<propsType>> = (props) => {
	/** 解构props */
	const {
		text = "", /** 需要复制到剪贴板的文本 */
		onCopy, /** 复制完成后的回调函数 */
		debug, /** 是否在控制台中打印调试信息 */
		message, /** 复制完成后的提示信息 */
		format, /** 需要复制的格式 */
		children, /** 传入的子元素 */
	} = props;

	/** 获取唯一的子元素 */
	const elem = Children.only(children);

	/**
	 * 处理点击事件
	 * @param {MouseEvent} event - 鼠标事件对象
	 */
	function onClick(event: MouseEvent) {
		/** 获取唯一的子元素 */
		const elem = Children.only(children);

		/** 复制文本到剪贴板 */
		const result = copy(text, {
			debug,
			message,
			format,
		});

		/** 执行复制完成回调 */
		if (onCopy) {
			onCopy(text, result);
		}

		/** 执行子元素的点击事件 */
		if (typeof elem?.props?.onClick === "function") {
			elem.props.onClick(event);
		}
	}

	/** 克隆子元素并添加点击事件 */
	return cloneElement(elem!, { onClick });
};

export default CopyToClipboard;
