import type { ReactElement } from "react";

export interface propsType {
	/**
	 * 点击时,实际复制的文本
	 */
	text?: string;
	/**
	 * 额外的点击参数,
	 *
	 * text 实际复制的文本
	 *
	 * result 接收copy-to-clipboard调用后的返回值result
	 */
	onCopy?: (text: string, result: boolean) => void;
	/**
	 * copy-to-clipboard的options参数
	 */
	debug?: boolean;
	/**
	 * copy-to-clipboard的options参数
	 */
	message?: string;
	/**
	 * copy-to-clipboard的options参数
	 */
	format?: string;
	children?: ReactElement;
	// options?: {
	// 	debug?: boolean;
	// 	message?: string;
	// 	format?: string;
	// }
}
