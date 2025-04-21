/**
 * 导入文件类型
 */
import { Files } from "@/components/Playground/PlaygroundContext.tsx";

// 文件名常量
export const APP_COMPONENT_FILE_NAME = "App.tsx";
export const ENTRY_FILE_NAME = "main.tsx";
export const IMPORT_MAP_FILE_NAME = "import-map.json";

/**
 * 模板配置接口
 */
export interface TemplateConfig {
	name: string;
	description: string;
	files: Files;
	id: string;
}

/**
 * 可用的模板ID，用于类型提示
 */
export type TemplateId = "basic" | "hooks" | string;

/**
 * 模板包装对象，包含模板信息和文件内容
 */
export interface TemplateWrapper {
	name: string;
	description: string;
	files: Files;
}

/**
 * 默认的模板配置记录
 */
export let templates: Record<string, TemplateConfig> = {};

/**
 * 基础模板回退
 */
function createFallbackTemplate(): TemplateWrapper {
	return {
		name: "基础模板",
		description: "简单的React应用，适合入门学习",
		files: {
			[APP_COMPONENT_FILE_NAME]: {
				name: APP_COMPONENT_FILE_NAME,
				language: "typescript",
				value: `import React from 'react';
import './App.css';

export default function App() {
	return (
		<div className="app">
			<h1>React Playground</h1>
			<p>模板加载失败，这是备用模板</p>
		</div>
	);
}`,
			},
			"App.css": {
				name: "App.css",
				language: "css",
				value: `body { margin: 0; font-family: sans-serif; }
.app { padding: 20px; text-align: center; }`,
			},
			[ENTRY_FILE_NAME]: {
				name: ENTRY_FILE_NAME,
				language: "typescript",
				value: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
			},
			[IMPORT_MAP_FILE_NAME]: {
				name: IMPORT_MAP_FILE_NAME,
				language: "json",
				value: `{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0"
  }
}`,
			},
		},
	};
}

/**
 * 初始化文件集合 - 注意：这是默认值，组件应该使用这个值作为初始状态，而不是直接引用
 */
export const initFiles: Files = createFallbackTemplate().files;

/**
 * 已知的模板ID列表 - 用于尝试加载，但不限制只加载这些模板
 */
const KNOWN_TEMPLATE_IDS = ["basic", "hooks", "redux", "router"];

/**
 * 模板的默认信息配置
 */
const DEFAULT_TEMPLATE_INFO: Record<string, { name: string; description: string }> = {
	basic: {
		name: "基础模板",
		description: "简单的React应用，适合入门学习",
	},
	hooks: {
		name: "React Hooks",
		description: "展示React Hooks基本用法的Todo应用",
	},
	redux: {
		name: "Redux状态管理",
		description: "使用Redux进行状态管理的Todo应用",
	},
	router: {
		name: "React Router",
		description: "使用React Router的多页面应用示例",
	},
};

/**
 * 获取默认模板名称
 * @param id 模板ID
 * @returns 默认模板名称
 */
function getDefaultTemplateName(id: string): string {
	return DEFAULT_TEMPLATE_INFO[id]?.name || `${id}模板`;
}

/**
 * 获取默认模板描述
 * @param id 模板ID
 * @returns 默认模板描述
 */
function getDefaultTemplateDescription(id: string): string {
	return DEFAULT_TEMPLATE_INFO[id]?.description || `${id}模板示例`;
}

/**
 * 加载所有模板
 * @returns 所有模板的配置和基础模板文件
 */
export async function loadTemplates(): Promise<{
	templates: Record<string, TemplateConfig>;
	baseFiles: Files;
}> {
	console.log("开始加载所有模板...");

	// 创建结果对象
	const templateConfigs: Record<string, TemplateConfig> = {};
	// 基础文件，用于返回给调用者作为初始状态
	let baseFiles: Files = { ...createFallbackTemplate().files };

	try {
		// 尝试加载已知的模板ID
		for (const id of KNOWN_TEMPLATE_IDS) {
			try {
				console.log(`尝试加载模板: ${id}`);
				// 动态导入模板
				const templateModule = await import(`./templates/${id}/index`).catch((e) => {
					console.warn(`模板 ${id} 导入失败:`, e);
					return null;
				});

				// 如果成功加载模板
				if (templateModule && templateModule.createTemplate) {
					// 调用createTemplate获取模板包装对象
					const templateWrapper = templateModule.createTemplate();

					// 确保返回的文件对象有效
					if (templateWrapper && templateWrapper.files && Object.keys(templateWrapper.files).length > 0) {
						templateConfigs[id] = {
							id,
							name: templateWrapper.name || templateModule.name || getDefaultTemplateName(id),
							description: templateWrapper.description || templateModule.description || getDefaultTemplateDescription(id),
							files: templateWrapper.files,
						};
						console.log(`成功加载模板: ${id}, 文件数量: ${Object.keys(templateWrapper.files).length}`);

						// 如果是基础模板，保存副本作为默认文件
						if (id === "basic") {
							baseFiles = JSON.parse(JSON.stringify(templateWrapper.files));
							console.log("更新基础文件为Basic模板");
						}
					} else {
						console.warn(`模板 ${id} 没有返回有效的文件`);

						// 如果是基础模板且加载失败，使用备用模板
						if (id === "basic") {
							const fallback = createFallbackTemplate();
							templateConfigs[id] = {
								id,
								name: fallback.name,
								description: fallback.description,
								files: fallback.files,
							};
							console.log("使用备用基础模板");
						}
					}
				} else {
					console.warn(`模板 ${id} 加载失败或没有 createTemplate 方法`);

					// 如果是基础模板且加载失败，使用备用模板
					if (id === "basic") {
						const fallback = createFallbackTemplate();
						templateConfigs[id] = {
							id,
							name: fallback.name,
							description: fallback.description,
							files: fallback.files,
						};
						console.log("使用备用基础模板");
					}
				}
			} catch (error) {
				console.warn(`加载模板 ${id} 时出错:`, error);

				// 如果是基础模板且加载失败，使用备用模板
				if (id === "basic") {
					const fallback = createFallbackTemplate();
					templateConfigs[id] = {
						id,
						name: fallback.name,
						description: fallback.description,
						files: fallback.files,
					};
					console.log("加载失败，使用备用基础模板");
				}
			}
		}

		// 确保basic模板始终存在
		if (!templateConfigs["basic"]) {
			const fallback = createFallbackTemplate();
			templateConfigs["basic"] = {
				id: "basic",
				name: fallback.name,
				description: fallback.description,
				files: fallback.files,
			};
			console.log("确保基础模板存在");
		}

		// 更新全局模板配置（作为缓存，但组件不应直接使用）
		templates = { ...templateConfigs };
	} catch (error) {
		console.error("加载模板出错:", error);

		// 加载出错时，确保至少有基础模板
		const fallback = createFallbackTemplate();
		templateConfigs["basic"] = {
			id: "basic",
			name: fallback.name,
			description: fallback.description,
			files: fallback.files,
		};
		templates = { ...templateConfigs };
		baseFiles = { ...fallback.files };
	}

	return {
		templates: templateConfigs,
		baseFiles,
	};
}

/**
 * 初始化应用，加载模板
 * @returns 初始文件状态
 */
export async function initializeApp(): Promise<Files> {
	try {
		console.log("开始初始化应用...");

		// 加载模板
		const { templates: loadedTemplates, baseFiles } = await loadTemplates();
		console.log("模板加载完成，获取到的模板:", Object.keys(loadedTemplates).join(", "));
		console.log("初始化完成，可用的文件数量:", Object.keys(baseFiles).length);

		// 返回基础文件作为初始状态
		return baseFiles;
	} catch (error) {
		console.error("应用初始化失败:", error);
		console.log("将使用备用基础模板");

		// 出错时返回备用模板
		return { ...createFallbackTemplate().files };
	}
}
