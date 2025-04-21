/**
 * 导入React钩子
 */
import { useContext } from "react";
/**
 * 导入代码编辑器组件
 */
import Editor from "./Editor";
/**
 * 导入文件名列表组件
 */
import FileNameList from "./FileNameList";
/**
 * 导入Playground上下文
 */
import { PlaygroundContext } from "@/components/Playground/PlaygroundContext.tsx";
/**
 * 导入防抖函数
 */
import { debounce } from "lodash-es";

/**
 * 代码编辑器组件
 *
 * 提供文件列表和代码编辑功能，支持多文件编辑
 * 使用方法: <CodeEditor />
 */
export default function CodeEditor() {
	/**
	 * 从上下文中获取主题、文件列表和相关状态函数
	 */
	const { theme, files, setFiles, selectedFileName } = useContext(PlaygroundContext);

	/**
	 * 获取当前选中的文件
	 */
	const file = files[selectedFileName];
	console.log("file", files, file);
	/**
	 * 编辑器内容变化时的处理函数
	 * @param value 变化后的代码内容
	 */
	function onEditorChange(value?: string) {
		files[file.name].value = value!;
		setFiles({ ...files });
	}

	/**
	 * 渲染代码编辑器界面
	 */
	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			{/* 文件名列表 */}
			<FileNameList />
			{/* 代码编辑器 */}
			<Editor
				file={file}
				onChange={debounce(onEditorChange, 500)}
				options={{
					theme: `vs-${theme}`,
				}}
			/>
		</div>
	);
}
