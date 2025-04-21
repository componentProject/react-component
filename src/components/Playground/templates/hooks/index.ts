/**
 * 导入文件类型
 */
import { Files, TemplateWrapper } from "@/components/Playground/files";
/**
 * 导入文件名到语言的转换函数
 */
import { fileName2Language } from "@/components/Playground/utils";
/**
 * 导入模板文件
 */
import importMap from "./import-map.json?raw";
import App from "./App.tsx?raw";
import AppCss from "./App.css?raw";
import main from "./main.tsx?raw";
import html from "./index.html?raw";
/**
 * 导入常量
 */
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from "@/components/Playground/files";

/**
 * Hooks模板名称
 */
export const name = "React Hooks";

/**
 * Hooks模板描述
 */
export const description = "展示React Hooks基本用法的Todo应用";

/**
 * 创建Hooks模板文件
 * @returns Hooks模板包装对象
 */
export function createTemplate(): TemplateWrapper {
	return {
		name: "React Hooks",
		description: "展示React Hooks基本用法的Todo应用",
		files: {
			[ENTRY_FILE_NAME]: {
				name: ENTRY_FILE_NAME,
				language: fileName2Language(ENTRY_FILE_NAME),
				value: main,
			},
			[APP_COMPONENT_FILE_NAME]: {
				name: APP_COMPONENT_FILE_NAME,
				language: fileName2Language(APP_COMPONENT_FILE_NAME),
				value: App,
			},
			"App.css": {
				name: "App.css",
				language: "css",
				value: AppCss,
			},
			[IMPORT_MAP_FILE_NAME]: {
				name: IMPORT_MAP_FILE_NAME,
				language: fileName2Language(IMPORT_MAP_FILE_NAME),
				value: importMap,
			},
			"index.html": {
				name: "index.html",
				language: "html",
				value: html,
			},
		},
	};
}
