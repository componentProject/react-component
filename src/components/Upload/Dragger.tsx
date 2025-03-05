import { useState } from "react";
import type { FC, DragEvent } from "react";
import type { DraggerProps } from "./types";
import classNames from "classnames";

/** Dragger组件,用于拖拽上传文件 */
export const Dragger: FC<DraggerProps> = (props) => {
	/** props.onFile是从外部传入的钩子函数,用于选择文件时的回调 */
	const { onFile, children } = props;

	/** dragOver是组件的状态,用于控制组件的样式 */
	const [dragOver, setDragOver] = useState(false);

	/** cs是组件的classname,其值是 upload-dragger,如果dragOver为true,则加上is-dragover的classname */
	const cs = classNames("upload-dragger", {
		"is-dragover": dragOver,
	});

	/**
	 * handleDrop是文件拖拽释放的回调函数,其作用是:
	 * 1. 阻止浏览器的默认行为
	 * 2. 将dragOver状态设置为false
	 * 3. 调用props.onFile钩子函数,将文件传递给外部
	 */
	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		setDragOver(false);
		onFile(e.dataTransfer.files);
	};

	/**
	 * handleDrag是文件拖拽的回调函数,其作用是:
	 * 1. 阻止浏览器的默认行为
	 * 2. 将dragOver状态设置为true或false
	 */
	const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
		e.preventDefault();
		setDragOver(over);
	};

	return (
		/**  div是Dragger组件的根元素,其classname是cs */
		<div
			className={cs}
			/**  onDragOver是文件拖拽到div上的回调函数,其作用是将dragOver状态设置为true */
			onDragOver={(e) => {
				handleDrag(e, true);
			}}
			/**  onDragLeave是文件拖拽离开div上的回调函数,其作用是将dragOver状态设置为false */
			onDragLeave={(e) => {
				handleDrag(e, false);
			}}
			/**  onDrop是文件拖拽释放的回调函数,其作用是调用handleDrop函数 */
			onDrop={handleDrop}
		>
			{
				/**  children是Dragger组件的子元素 */
				children
			}
		</div>
	);
};

export default Dragger;
