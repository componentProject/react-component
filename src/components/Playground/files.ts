/**
 * 导入文件类型
 */
import { Files } from "@/components/Playground/PlaygroundContext.tsx";

import { createTemplate as createFallbackTemplate } from "@/components/Playground/templates/basic";

// 文件名常量
export const APP_COMPONENT_FILE_NAME = "App.tsx";
export const ENTRY_FILE_NAME = "main.tsx";
export const IMPORT_MAP_FILE_NAME = "import-map.json";

/**
 * 模板类型定义
 */
export enum TemplateType {
	Basic = "basic",
	Hooks = "hooks",
	Redux = "redux",
	Router = "router",
}

/**
 * 模板配置接口
 */
export interface TemplateConfig {
	name: string;
	description: string;
	files: Files;
}

/**
 * 默认的模板配置记录
 */
export let templates: Record<TemplateType, TemplateConfig> = {} as Record<TemplateType, TemplateConfig>;

/**
 * 初始化文件集合
 */
export let initFiles: Files = createFallbackTemplate();

/**
 * 加载所有模板
 * @returns 所有模板的配置
 */
export async function loadTemplates(): Promise<Record<TemplateType, TemplateConfig>> {
	console.log("开始加载所有模板...");

	// 创建结果对象
	const templateConfigs: Record<TemplateType, TemplateConfig> = {} as Record<TemplateType, TemplateConfig>;

	// 设置默认模板信息，但不设置文件内容
	Object.values(TemplateType).forEach((type) => {
		templateConfigs[type] = {
			name: getDefaultTemplateName(type),
			description: getDefaultTemplateDescription(type),
			files: {},
		};
	});

	try {
		// 获取所有可用的模板目录
		const templateTypes = Object.values(TemplateType);

		// 遍历所有模板类型，尝试动态加载
		for (const type of templateTypes) {
			try {
				console.log(`尝试加载模板: ${type}`);
				// 动态导入模板
				const templateModule = await import(`@/components/Playground/templates/${type}/index`).catch((e) => {
					console.warn(`模板 ${type} 导入失败:`, e);
					return null;
				});

				// 如果成功加载模板
				if (templateModule && templateModule.createTemplate) {
					const templateFiles = templateModule.createTemplate();
					// 确保返回的文件对象有效
					if (templateFiles && Object.keys(templateFiles).length > 0) {
						templateConfigs[type] = {
							name: templateModule.name || templateConfigs[type].name,
							description: templateModule.description || templateConfigs[type].description,
							files: templateFiles,
						};
						console.log(`成功加载模板: ${type}, 文件数量: ${Object.keys(templateFiles).length}`);
					} else {
						console.warn(`模板 ${type} 没有返回有效的文件`);

						// 如果是基础模板且加载失败，使用备用模板
						if (type === TemplateType.Basic) {
							templateConfigs[type].files = createFallbackTemplate();
							console.log("使用备用基础模板");
						}
					}
				} else {
					console.warn(`模板 ${type} 加载失败或没有 createTemplate 方法`);

					// 如果是基础模板且加载失败，使用备用模板
					if (type === TemplateType.Basic) {
						templateConfigs[type].files = createFallbackTemplate();
						console.log("使用备用基础模板");
					}
				}
			} catch (error) {
				console.warn(`加载模板 ${type} 时出错:`, error);

				// 如果是基础模板且加载失败，使用备用模板
				if (type === TemplateType.Basic) {
					templateConfigs[type].files = createFallbackTemplate();
					console.log("加载失败，使用备用基础模板");
				}
			}
		}

		// 更新全局模板配置
		templates = { ...templateConfigs };

		// 更新初始文件为基础模板
		if (Object.keys(templateConfigs[TemplateType.Basic].files).length > 0) {
			initFiles = { ...templateConfigs[TemplateType.Basic].files };
			console.log("初始文件设置为基础模板，文件数量:", Object.keys(initFiles).length);
		} else {
			// 如果基础模板加载失败，使用备用模板
			initFiles = createFallbackTemplate();
			console.log("基础模板加载失败，使用备用模板");
		}
	} catch (error) {
		console.error("加载模板出错:", error);

		// 加载出错时，确保至少有基础模板
		const fallbackTemplate = createFallbackTemplate();
		templateConfigs[TemplateType.Basic] = {
			name: getDefaultTemplateName(TemplateType.Basic),
			description: getDefaultTemplateDescription(TemplateType.Basic),
			files: fallbackTemplate,
		};
		templates = { ...templateConfigs };
		initFiles = { ...fallbackTemplate };
	}

	return templateConfigs;
}

/**
 * 获取默认模板名称
 * @param type 模板类型
 * @returns 默认模板名称
 */
function getDefaultTemplateName(type: TemplateType): string {
	switch (type) {
		case TemplateType.Basic:
			return "基础模板";
		case TemplateType.Hooks:
			return "React Hooks";
		case TemplateType.Redux:
			return "Redux状态管理";
		case TemplateType.Router:
			return "React Router";
		default:
			return "未知模板";
	}
}

/**
 * 获取默认模板描述
 * @param type 模板类型
 * @returns 默认模板描述
 */
function getDefaultTemplateDescription(type: TemplateType): string {
	switch (type) {
		case TemplateType.Basic:
			return "简单的React应用，适合入门学习";
		case TemplateType.Hooks:
			return "展示React Hooks基本用法的Todo应用";
		case TemplateType.Redux:
			return "使用Redux进行状态管理的Todo应用";
		case TemplateType.Router:
			return "使用React Router的多页面应用示例";
		default:
			return "";
	}
}

/**
 * 初始化应用，加载模板
 */
export async function initializeApp() {
	try {
		console.log("开始初始化应用...");
		console.log("初始状态: 文件数量 =", Object.keys(initFiles).length);

		// 加载模板
		const loadedTemplates = await loadTemplates();
		console.log("模板加载完成，获取到的模板:", Object.keys(loadedTemplates).join(", "));

		// 确保有可用的基础模板
		if (Object.keys(loadedTemplates[TemplateType.Basic].files).length === 0) {
			console.warn("基础模板加载失败，使用备用模板");
			// 使用备用模板
			const fallbackTemplate = createFallbackTemplate();
			loadedTemplates[TemplateType.Basic].files = fallbackTemplate;
			templates[TemplateType.Basic].files = fallbackTemplate;
			initFiles = { ...fallbackTemplate };
		}

		console.log("初始化完成，可用的文件数量:", Object.keys(initFiles).length);
	} catch (error) {
		console.error("应用初始化失败:", error);
		console.log("将使用备用基础模板");

		// 确保即使失败也有基础模板
		const fallbackTemplate = createFallbackTemplate();
		templates = {
			[TemplateType.Basic]: {
				name: getDefaultTemplateName(TemplateType.Basic),
				description: getDefaultTemplateDescription(TemplateType.Basic),
				files: fallbackTemplate,
			},
			[TemplateType.Hooks]: {
				name: getDefaultTemplateName(TemplateType.Hooks),
				description: getDefaultTemplateDescription(TemplateType.Hooks),
				files: {},
			},
			[TemplateType.Redux]: {
				name: getDefaultTemplateName(TemplateType.Redux),
				description: getDefaultTemplateDescription(TemplateType.Redux),
				files: {},
			},
			[TemplateType.Router]: {
				name: getDefaultTemplateName(TemplateType.Router),
				description: getDefaultTemplateDescription(TemplateType.Router),
				files: {},
			},
		};
		initFiles = { ...fallbackTemplate };
	}
}
