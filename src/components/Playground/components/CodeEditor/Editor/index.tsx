/**
 * 导入Monaco编辑器组件和类型
 */
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react'
/**
 * 导入自动类型分析工具
 */
import { createATA } from './ata';
/**
 * 导入编辑器类型
 */
import { editor } from 'monaco-editor'

/**
 * 编辑器文件接口
 */
export interface EditorFile {
    name: string
    value: string
    language: string
}

/**
 * 编辑器组件属性接口
 */
interface Props {
    file: EditorFile
    onChange?: EditorProps['onChange'],
    options?: editor.IStandaloneEditorConstructionOptions
}

/**
 * 代码编辑器组件
 * 
 * 基于Monaco编辑器的代码编辑器，支持语法高亮、自动完成等功能
 * @param props 组件属性
 */
export default function Editor(props: Props) {

    /**
     * 解构组件属性
     */
    const {
        file,
        onChange,
        options
    } = props;

    /**
     * 编辑器加载完成时的处理函数
     * @param editor 编辑器实例
     * @param monaco Monaco实例
     */
    const handleEditorMount: OnMount = (editor, monaco) => {

        /**
         * 添加快捷键命令，Ctrl+J格式化代码
         */
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
            editor.getAction('editor.action.formatDocument')?.run()
            // let actions = editor.getSupportedActions().map((a) => a.id);
            // console.log(actions);
        });

        /**
         * 设置TypeScript编译器选项
         */
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.Preserve,
            esModuleInterop: true,
        })

        /**
         * 创建自动类型分析工具，用于提供智能提示
         */
        const ata = createATA((code, path) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
        })

        /**
         * 当编辑器内容变化时，触发类型分析
         */
        editor.onDidChangeModelContent(() => {
            ata(editor.getValue());
        });

        /**
         * 初始分析当前编辑器内容
         */
        ata(editor.getValue());
    }

    /**
     * 渲染Monaco编辑器
     */
    return <MonacoEditor
        height={'100%'}
        path={file.name}
        language={file.language}
        onMount={handleEditorMount}
        onChange={onChange}
        value={file.value}
        options={
            {
                fontSize: 14,
                scrollBeyondLastLine: false,
                minimap: {
                  enabled: false,
                },
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
                ...options
            }
        }
    />
}
