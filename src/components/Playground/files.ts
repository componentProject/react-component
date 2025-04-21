/**
 * 导入文件类型
 */
import { Files } from "./PlaygroundContext.tsx";

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

// 基础文件，用于在动态加载前提供默认内容
export const initFiles: Files = {
	[APP_COMPONENT_FILE_NAME]: {
		name: APP_COMPONENT_FILE_NAME,
		language: "typescript",
		value: `import React from 'react';
import './App.css';

export default function App() {
	return (
		<div className="app">
			<h1>React Playground</h1>
			<p>加载中...</p>
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
};

/**
 * 默认的模板配置，包含基本内容以防动态加载失败
 */
export const templates: Record<TemplateType, TemplateConfig> = {
	[TemplateType.Basic]: {
		name: "基础模板",
		description: "简单的React应用，适合入门学习",
		files: { ...initFiles }, // 使用我们刚刚定义的默认文件作为基础模板
	},
	[TemplateType.Hooks]: {
		name: "React Hooks",
		description: "展示React Hooks基本用法的Todo应用",
		files: { ...initFiles },
	},
	[TemplateType.Redux]: {
		name: "Redux状态管理",
		description: "使用Redux进行状态管理的Todo应用",
		files: { ...initFiles },
	},
	[TemplateType.Router]: {
		name: "React Router",
		description: "使用React Router的多页面应用示例",
		files: { ...initFiles },
	},
};

/**
 * 加载模板
 * @returns 所有模板的配置
 */
export async function getTemplates(): Promise<Record<TemplateType, TemplateConfig>> {
	// 创建结果对象
	const templateConfigs: Record<TemplateType, TemplateConfig> = {
		[TemplateType.Basic]: {
			name: "基础模板",
			description: "简单的React应用，适合入门学习",
			files: {},
		},
		[TemplateType.Hooks]: {
			name: "React Hooks",
			description: "展示React Hooks基本用法的Todo应用",
			files: {},
		},
		[TemplateType.Redux]: {
			name: "Redux状态管理",
			description: "使用Redux进行状态管理的Todo应用",
			files: {},
		},
		[TemplateType.Router]: {
			name: "React Router",
			description: "使用React Router的多页面应用示例",
			files: {},
		},
	};

	try {
		// 动态加载Basic模板
		try {
			const basicModule = await import("./templates/basic/index");
			if (basicModule) {
				templateConfigs[TemplateType.Basic] = {
					name: basicModule.name || "基础模板",
					description: basicModule.description || "简单的React应用，适合入门学习",
					files: basicModule.createTemplate(),
				};
				console.log("加载了Basic模板");
			}
		} catch (basicError) {
			console.warn("加载Basic模板失败:", basicError);
		}

		// 动态加载Hooks模板
		try {
			const hooksModule = await import("./templates/hooks/index");
			if (hooksModule) {
				templateConfigs[TemplateType.Hooks] = {
					name: hooksModule.name || "React Hooks",
					description: hooksModule.description || "展示React Hooks基本用法的Todo应用",
					files: hooksModule.createTemplate(),
				};
				console.log("加载了Hooks模板");
			}
		} catch (hookError) {
			console.warn("加载Hooks模板失败:", hookError);
		}

		// 动态加载Redux模板
		try {
			const reduxModule = await import("./templates/redux/index");
			if (reduxModule) {
				templateConfigs[TemplateType.Redux] = {
					name: reduxModule.name || "Redux状态管理",
					description: reduxModule.description || "使用Redux进行状态管理的Todo应用",
					files: reduxModule.createTemplate(),
				};
				console.log("加载了Redux模板");
			}
		} catch (reduxError) {
			console.warn("加载Redux模板失败:", reduxError);
		}

		// 动态加载Router模板
		try {
			const routerModule = await import("./templates/router/index");
			if (routerModule) {
				templateConfigs[TemplateType.Router] = {
					name: routerModule.name || "React Router",
					description: routerModule.description || "使用React Router的多页面应用示例",
					files: routerModule.createTemplate(),
				};
				console.log("加载了Router模板");
			}
		} catch (routerError) {
			console.warn("加载Router模板失败:", routerError);
		}

		// 更新全局模板配置
		Object.assign(templates, templateConfigs);

		// 更新初始文件为基础模板
		if (Object.keys(templateConfigs[TemplateType.Basic].files).length > 0) {
			Object.assign(initFiles, templateConfigs[TemplateType.Basic].files);
		}
	} catch (error) {
		console.error("加载模板出错:", error);
	}

	return templateConfigs;
}

/**
 * 初始化应用，加载模板
 */
export async function initializeApp() {
	try {
		console.log('开始初始化应用...');
		console.log('当前初始文件状态:', Object.keys(initFiles).length > 0 ? '有效' : '为空');
		
		// 加载模板
		const loadedTemplates = await getTemplates();
		console.log('模板加载完成，获取到的模板:', Object.keys(loadedTemplates).join(', '));
		
		// 如果基础模板加载成功，使用它作为初始文件
		if (Object.keys(loadedTemplates[TemplateType.Basic].files).length > 0) {
			console.log('使用新加载的基础模板更新初始文件');
			Object.assign(initFiles, loadedTemplates[TemplateType.Basic].files);
			console.log('初始文件加载完成，文件数量:', Object.keys(initFiles).length);
		} else {
			console.warn('基础模板加载失败，但应用仍将使用默认模板继续工作');
		}
	} catch (error) {
		console.error('应用初始化失败:', error);
		console.log('将继续使用默认模板');
	}
}
