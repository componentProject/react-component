/**
 * 导入Monaco编辑器组件
 */
import MonacoEditor, { OnMount } from "@monaco-editor/react";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "@/components/LowCodeEditor/stores/components";

/**
 * 源码组件
 *
 * 提供JSON格式显示当前组件树结构，使用Monaco编辑器展示
 * 用户可以查看完整的组件配置信息
 *
 * @returns {JSX.Element} Monaco编辑器组件
 */
export function Source() {
	/**
	 * 获取组件树数据
	 */
	const { components } = useComponetsStore();

	/**
	 * 编辑器初始化处理函数
	 * 添加快捷键Ctrl+J/Cmd+J进行代码格式化
	 *
	 * @param {monaco.editor.IStandaloneCodeEditor} editor - 编辑器实例
	 * @param {any} monaco - Monaco编辑器命名空间
	 */
	const handleEditorMount: OnMount = (editor, monaco) => {
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
			editor.getAction("editor.action.formatDocument")?.run();
		});
	};

	/**
	 * 渲染Monaco编辑器
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
