import type { ReactElement } from "react";

/**
 * CopyToClipboard组件的props类型
 */
export interface propsType {
	/**
	 * 点击时,实际复制的文本
	 *
	 * 例如,你想在点击时复制一个变量的值
	 * <CopyToClipboard text={this.state.text}>Copy</CopyToClipboard>
	 */
	text?: string;
	/**
	 * 额外的点击参数,
	 *
	 * text 实际复制的文本
	 *
	 * result 接收copy-to-clipboard调用后的返回值result,
	 *  result为true时表示复制成功,否则为false
	 *
	 * 例如,你想在点击时复制一个变量的值，并在复制成功时弹出提示
	 * <CopyToClipboard text={this.state.text} onCopy={(text, result) => {
	 *  if (result) {
	 *    alert(`复制${text}成功`);
	 *  }
	 * }}>Copy</CopyToClipboard>
	 */
	onCopy?: (text: string, result: boolean) => void;
	/**
	 * copy-to-clipboard的options参数
	 *
	 * debug为true时，copy-to-clipboard将在控制台中输出详细的日志
	 */
	debug?: boolean;
	/**
	 * copy-to-clipboard的options参数
	 *
	 * message为需要复制的文本的描述,将在控制台中输出
	 */
	message?: string;
	/**
	 * copy-to-clipboard的options参数
	 *
	 * format为需要复制的文本的格式,例如"html"或"markdown"
	 */
	format?: string;
	/**
	 * ReactElement类型的children
	 *
	 * CopyToClipboard组件将渲染children，并在点击时复制text
	 */
	children?: ReactElement;
}
