/**
 * 导入Monaco编辑器组件和类型
 */
import MonacoEditor, { OnMount } from "@monaco-editor/react";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "../../stores/components";

/**
 * 源码编辑器组件
 *
 * 用法: <Source />
 *
 * 提供组件树JSON的只读视图，使用Monaco编辑器显示格式化的JSON
 *
 * @returns {JSX.Element} 渲染的源码编辑器
 */
export function Source() {
	/**
	 * 从组件状态存储中获取组件列表
	 */
	const { components } = useComponetsStore();

	/**
	 * 编辑器挂载处理函数
	 * 添加格式化文档的快捷键(Ctrl+J)
	 *
	 * @param {any} editor 编辑器实例
	 * @param {any} monaco Monaco实例
	 */
	const handleEditorMount: OnMount = (editor, monaco) => {
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
			editor.getAction("editor.action.formatDocument")?.run();
		});
	};

	/**
	 * 渲染Monaco编辑器
	 * 配置为JSON语言模式，并设置UI选项
	 */
	return (
		<MonacoEditor
			height={"100%"}
			path="components.json"
			language="json"
			onMount={handleEditorMount}
			value={JSON.stringify(components, null, 2)}
			options={{
				fontSize: 14,
				scrollBeyondLastLine: false,
				minimap: {
					enabled: false,
				},
				scrollbar: {
					verticalScrollbarSize: 6,
					horizontalScrollbarSize: 6,
				},
			}}
		/>
	);
}
