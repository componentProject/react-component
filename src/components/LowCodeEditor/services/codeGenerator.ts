/**
 * 导入组件树类型
 */
import { Component } from "@/components/LowCodeEditor/stores/components";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "@/components/LowCodeEditor/stores/component-config";

/**
 * 代码生成器配置接口
 * @interface CodeGeneratorOptions
 */
export interface CodeGeneratorOptions {
	/** 是否生成CSS文件 */
	generateCSS?: boolean;
	/** 是否包含导入语句 */
	includeImports?: boolean;
	/** 目标框架 */
	framework?: "react" | "vue";
	/** 文件类型 */
	fileType?: "tsx" | "jsx" | "js";
	/** 样式类型 */
	styleType?: "css" | "scss" | "less" | "styled-components";
	/** 是否生成package.json */
	generatePackageJson?: boolean;
	/** 是否生成项目配置文件 */
	generateProjectFiles?: boolean;
}

/**
 * 生成的代码文件接口
 * @interface GeneratedCode
 */
export interface GeneratedCode {
	/** 主要组件代码 */
	componentCode: string;
	/** 样式代码 */
	styleCode?: string;
	/** 是否使用TypeScript */
	isTypeScript: boolean;
	/** package.json内容 */
	packageJson?: string;
	/** index.html内容 */
	indexHtml?: string;
	/** vite.config.ts内容 */
	viteConfig?: string;
}

/**
 * 组件导入映射表
 * 定义每种组件类型需要从哪个库导入
 */
const componentImportMap: Record<string, { package: string; component: string }> = {
	Button: { package: "antd", component: "Button" },
	Form: { package: "antd", component: "Form" },
	FormItem: { package: "antd", component: "Form.Item" },
	Input: { package: "antd", component: "Input" },
	DatePicker: { package: "antd", component: "DatePicker" },
	Container: { package: "antd", component: "div" },
	Table: { package: "antd", component: "Table" },
	Modal: { package: "antd", component: "Modal" },
	Page: { package: "", component: "div" },
};

/**
 * 默认代码生成器选项
 */
const defaultOptions: CodeGeneratorOptions = {
	generateCSS: true,
	includeImports: true,
	framework: "react",
	fileType: "tsx",
	styleType: "css",
	generatePackageJson: true,
	generateProjectFiles: true,
};

/**
 * 将驼峰命名转换为中划线命名
 * @param {string} str - 驼峰命名字符串
 * @returns {string} 转换后的中划线命名字符串
 */
function camelToDash(str: string): string {
	return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * 生成React组件导入代码
 * @param {Component[]} components - 组件树
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} 导入代码
 */
function generateImports(components: Component[], options: CodeGeneratorOptions): string {
	if (!options.includeImports) return "";

	const imports = new Map<string, Set<string>>();

	// 递归收集所有组件的导入
	function collectImports(comps: Component[]) {
		comps.forEach((comp) => {
			const importInfo = componentImportMap[comp.name];
			if (importInfo && importInfo.package) {
				if (!imports.has(importInfo.package)) {
					imports.set(importInfo.package, new Set());
				}
				imports.get(importInfo.package)?.add(importInfo.component);
			}

			// 处理子组件
			if (comp.children && comp.children.length > 0) {
				collectImports(comp.children);
			}
		});
	}

	collectImports(components);

	// 生成导入代码
	let importCode = "import React from 'react';\n";

	imports.forEach((components, packageName) => {
		importCode += `import { ${Array.from(components).join(", ")} } from '${packageName}';\n`;
	});

	// 如果使用样式导入
	if (options.generateCSS && options.styleType === "css") {
		importCode += "import './App.css';\n";
	}

	return importCode;
}

/**
 * 生成组件样式代码
 * @param {Component[]} components - 组件树
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} CSS代码
 */
function generateStyles(components: Component[], options: CodeGeneratorOptions): string {
	if (!options.generateCSS) return "";

	let cssCode = "";
	const styleClasses = new Map<string, Record<string, string | number>>();

	// 递归收集所有组件的样式
	function collectStyles(comps: Component[], prefix = "") {
		comps.forEach((comp) => {
			if (comp.styles) {
				const className = `${prefix}${comp.name.toLowerCase()}-${comp.id}`;
				styleClasses.set(`.${className}`, comp.styles as Record<string, string | number>);
			}

			// 处理子组件
			if (comp.children && comp.children.length > 0) {
				collectStyles(comp.children, `${prefix}${comp.name.toLowerCase()}-${comp.id} `);
			}
		});
	}

	collectStyles(components);

	// 生成CSS代码
	styleClasses.forEach((styles, selector) => {
		cssCode += `${selector} {\n`;

		Object.entries(styles).forEach(([property, value]) => {
			// 将驼峰命名转换为中划线命名
			const cssProperty = camelToDash(property);
			cssCode += `  ${cssProperty}: ${value};\n`;
		});

		cssCode += "}\n\n";
	});

	return cssCode;
}

/**
 * 生成组件JSX代码
 * @param {Component} component - 组件
 * @param {number} indentLevel - 缩进级别
 * @returns {string} JSX代码
 */
function generateComponentJSX(component: Component, indentLevel = 0): string {
	const indent = "  ".repeat(indentLevel);
	const componentConfig = useComponentConfigStore.getState().componentConfig[component.name];

	if (!componentConfig) {
		return `${indent}/* 未找到组件配置: ${component.name} */`;
	}

	// 获取组件映射信息
	const importInfo = componentImportMap[component.name];
	const ComponentName = importInfo ? importInfo.component : component.name;

	// 合并默认属性和用户配置的属性
	const props = { ...componentConfig.defaultProps, ...component.props };

	// 生成属性字符串
	let propsString = "";
	Object.entries(props).forEach(([key, value]) => {
		// 跳过children和内部使用的属性
		if (key === "children" || key === "id" || key === "name" || key === "desc") return;

		// 处理不同类型的值
		if (typeof value === "string") {
			propsString += ` ${key}="${value}"`;
		} else if (typeof value === "number" || typeof value === "boolean") {
			propsString += ` ${key}={${value}}`;
		} else if (value !== null && typeof value === "object") {
			propsString += ` ${key}={${JSON.stringify(value)}}`;
		}
	});

	// 添加样式类名
	const className = `${component.name.toLowerCase()}-${component.id}`;
	propsString += ` className="${className}"`;

	// 生成内联样式
	if (component.styles) {
		const styleObj = JSON.stringify(component.styles).replace(/"/g, "'").replace(/,/g, ", ");
		propsString += ` style={${styleObj}}`;
	}

	// 处理子组件
	let childrenJSX = "";
	if (component.children && component.children.length > 0) {
		childrenJSX = component.children.map((child) => generateComponentJSX(child, indentLevel + 1)).join("\n");

		// 返回带有子组件的JSX
		return `${indent}<${ComponentName}${propsString}>\n${childrenJSX}\n${indent}</${ComponentName}>`;
	}

	// 处理文本内容
	if (props.text) {
		return `${indent}<${ComponentName}${propsString}>${props.text}</${ComponentName}>`;
	}

	// 返回自闭合组件
	return `${indent}<${ComponentName}${propsString} />`;
}

/**
 * 生成React组件代码
 * @param {Component[]} components - 组件树
 * @param {string} componentName - 组件名称
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} 组件代码
 */
function generateReactComponent(components: Component[], componentName: string, options: CodeGeneratorOptions): string {
	const imports = generateImports(components, options);

	let jsxCode = "";
	components.forEach((component) => {
		jsxCode += generateComponentJSX(component);
	});

	const isTypeScript = options.fileType === "tsx";

	return `${imports}
${isTypeScript ? `interface ${componentName}Props {}\n` : ""}
function ${componentName}(${isTypeScript ? "props: " + componentName + "Props" : "props"}) {
  return (
${jsxCode}
  );
}

export default ${componentName};
`;
}

/**
 * 生成主入口文件代码
 * @param {string} componentName - 组件名称
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} main文件代码
 */
function generateMainFile(componentName: string, options: CodeGeneratorOptions): string {
	const isTypeScript = options.fileType === "tsx";
	const extension = isTypeScript ? ".tsx" : ".jsx";

	return `import React from 'react';
import ReactDOM from 'react-dom/client';
import ${componentName} from './${componentName}${extension.replace("x", "")}';
${options.generateCSS ? `import './App.${options.styleType}';` : ""}

ReactDOM.createRoot(document.getElementById('root')${isTypeScript ? " as HTMLElement" : ""}).render(
  <React.StrictMode>
    <${componentName} />
  </React.StrictMode>
);
`;
}

/**
 * 生成Vue组件代码
 * @param {Component[]} components - 组件树
 * @param {string} componentName - 组件名称
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} 组件代码
 */
function generateVueComponent(components: Component[], componentName: string, options: CodeGeneratorOptions): string {
	// 生成导入代码
	let importCode = "";
	const imports = new Map<string, Set<string>>();

	// 递归收集所有组件的导入
	function collectImports(comps: Component[]) {
		comps.forEach((comp) => {
			const importInfo = componentImportMap[comp.name];
			if (importInfo && importInfo.package) {
				if (!imports.has(importInfo.package)) {
					imports.set(importInfo.package, new Set());
				}
				imports.get(importInfo.package)?.add(importInfo.component);
			}

			// 处理子组件
			if (comp.children && comp.children.length > 0) {
				collectImports(comp.children);
			}
		});
	}

	// 只有在需要导入时才收集
	if (options.includeImports) {
		collectImports(components);

		// 生成导入代码
		imports.forEach((components, packageName) => {
			importCode += `import { ${Array.from(components).join(", ")} } from '${packageName}';\n`;
		});
	}

	// 生成Vue组件模板代码
	function generateVueTemplate(comps: Component[], indentLevel = 1): string {
		const indent = "  ".repeat(indentLevel);
		let template = "";

		comps.forEach((comp) => {
			const componentConfig = useComponentConfigStore.getState().componentConfig[comp.name];

			if (!componentConfig) {
				template += `${indent}<!-- 未找到组件配置: ${comp.name} -->\n`;
				return;
			}

			// 获取组件映射信息
			const importInfo = componentImportMap[comp.name];
			const tagName = importInfo ? importInfo.component.toLowerCase() : comp.name.toLowerCase();

			// 合并默认属性和用户配置的属性
			const props = { ...componentConfig.defaultProps, ...comp.props };

			// 生成属性字符串
			let propsString = "";
			Object.entries(props).forEach(([key, value]) => {
				// 跳过children和内部使用的属性
				if (key === "children" || key === "id" || key === "name" || key === "desc") return;

				// 处理不同类型的值
				if (typeof value === "string") {
					propsString += ` ${key}="${value}"`;
				} else if (typeof value === "number" || typeof value === "boolean") {
					propsString += ` :${key}="${value}"`;
				} else if (value !== null && typeof value === "object") {
					propsString += ` :${key}='${JSON.stringify(value)}'`;
				}
			});

			// 添加样式类名
			const className = `${comp.name.toLowerCase()}-${comp.id}`;
			propsString += ` class="${className}"`;

			// 生成内联样式
			if (comp.styles) {
				const styleObj = JSON.stringify(comp.styles).replace(/"/g, "'").replace(/,/g, ", ");
				propsString += ` :style="${styleObj}"`;
			}

			// 处理子组件
			if (comp.children && comp.children.length > 0) {
				const childrenTemplate = generateVueTemplate(comp.children, indentLevel + 1);
				template += `${indent}<${tagName}${propsString}>\n${childrenTemplate}${indent}</${tagName}>\n`;
			} else if (props.text) {
				// 处理文本内容
				template += `${indent}<${tagName}${propsString}>${props.text}</${tagName}>\n`;
			} else {
				// 返回自闭合组件
				template += `${indent}<${tagName}${propsString} />\n`;
			}
		});

		return template;
	}

	// 生成样式代码
	const stylesCode = generateStyles(components, options);

	// 生成Vue模板
	const template = generateVueTemplate(components);

	// 确定script类型
	const scriptType = options.fileType === "tsx" ? 'lang="ts"' : "";

	// 返回完整的Vue单文件组件
	return `<template>
${template}
</template>

<script ${scriptType}>
export default {
  name: '${componentName}',
  data() {
    return {};
  }
}
</script>

<style>
${stylesCode}
</style>`;
}

/**
 * 生成package.json文件
 * @param {Component[]} components - 组件树
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} package.json内容
 */
function generatePackageJson(components: Component[], options: CodeGeneratorOptions): string {
	// 收集依赖
	const dependencies: Record<string, string> = {
		react: "^18.2.0",
		"react-dom": "^18.2.0",
	};

	// 收集开发依赖
	const devDependencies: Record<string, string> = {
		"@types/react": "^18.2.15",
		"@types/react-dom": "^18.2.7",
		vite: "^4.4.5",
	};

	// 如果是TypeScript项目，添加TypeScript相关依赖
	if (options.fileType === "tsx") {
		devDependencies["typescript"] = "^5.0.2";
		devDependencies["@typescript-eslint/eslint-plugin"] = "^6.0.0";
		devDependencies["@typescript-eslint/parser"] = "^6.0.0";
	}

	// 递归收集所有组件的依赖
	function collectDependencies(comps: Component[]) {
		comps.forEach((comp) => {
			const importInfo = componentImportMap[comp.name];
			if (importInfo && importInfo.package && importInfo.package !== "") {
				dependencies[importInfo.package] = "*"; // 实际项目中应指定具体版本
			}

			// 处理子组件
			if (comp.children && comp.children.length > 0) {
				collectDependencies(comp.children);
			}
		});
	}

	collectDependencies(components);

	// 根据样式类型添加相应依赖
	if (options.styleType === "scss") {
		devDependencies["sass"] = "^1.63.6";
	} else if (options.styleType === "less") {
		devDependencies["less"] = "^4.1.3";
	} else if (options.styleType === "styled-components") {
		dependencies["styled-components"] = "^6.0.5";
		if (options.fileType === "tsx") {
			devDependencies["@types/styled-components"] = "^5.1.26";
		}
	}

	// 构建package.json对象
	const packageJson = {
		name: "generated-app",
		private: true,
		version: "0.0.0",
		type: "module",
		scripts: {
			dev: "vite",
			build: "vite build",
			preview: "vite preview",
			...(options.fileType === "tsx" && {
				lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
			}),
		},
		dependencies: dependencies,
		devDependencies: devDependencies,
	};

	return JSON.stringify(packageJson, null, 2);
}

/**
 * 生成index.html文件
 * @param {string} componentName - 组件名称
 * @returns {string} index.html内容
 */
function generateIndexHtml(componentName: string): string {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${componentName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

/**
 * 生成vite.config.ts文件
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} vite.config.ts内容
 */
function generateViteConfig(options: CodeGeneratorOptions): string {
	const isTypeScript = options.fileType === "tsx";

	return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})`;
}

/**
 * 生成tsconfig.json文件
 * @returns {string} tsconfig.json内容
 */
function generateTsConfig(): string {
	return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;
}

/**
 * 代码生成主函数
 * 将组件树转换为对应框架的代码
 *
 * @param {Component[]} components - 组件树
 * @param {string} componentName - 生成的组件名称
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {GeneratedCode} 生成的代码
 */
export function generateCode(
	components: Component[],
	componentName: string = "GeneratedApp",
	options: CodeGeneratorOptions = defaultOptions,
): GeneratedCode {
	const mergedOptions = { ...defaultOptions, ...options };

	let componentCode = "";
	let styleCode = "";
	let packageJson = "";
	let indexHtml = "";
	let viteConfig = "";
	let mainCode = "";

	// 根据目标框架生成代码
	if (mergedOptions.framework === "react") {
		componentCode = generateReactComponent(components, componentName, mergedOptions);
		if (mergedOptions.generateCSS) {
			styleCode = generateStyles(components, mergedOptions);
		}
		mainCode = generateMainFile(componentName, mergedOptions);
	} else if (mergedOptions.framework === "vue") {
		componentCode = generateVueComponent(components, componentName, mergedOptions);
		// Vue组件样式通常包含在单文件组件中
	}

	// 生成package.json
	if (mergedOptions.generatePackageJson) {
		packageJson = generatePackageJson(components, mergedOptions);
	}

	// 生成项目配置文件
	if (mergedOptions.generateProjectFiles) {
		indexHtml = generateIndexHtml(componentName);
		viteConfig = generateViteConfig(mergedOptions);
	}

	return {
		componentCode,
		styleCode: mergedOptions.generateCSS ? styleCode : undefined,
		isTypeScript: mergedOptions.fileType === "tsx",
		packageJson: mergedOptions.generatePackageJson ? packageJson : undefined,
		indexHtml: mergedOptions.generateProjectFiles ? indexHtml : undefined,
		viteConfig: mergedOptions.generateProjectFiles ? viteConfig : undefined,
	};
}

/**
 * 导出文件的函数
 * 将生成的代码保存为文件并提供下载
 *
 * @param {GeneratedCode} generatedCode - 生成的代码
 * @param {string} filename - 文件名（不含扩展名）
 * @param {CodeGeneratorOptions} options - 生成选项
 */
export function exportGeneratedCode(
	generatedCode: GeneratedCode,
	filename: string = "GeneratedApp",
	options: CodeGeneratorOptions = defaultOptions,
): void {
	const { componentCode, styleCode, isTypeScript, packageJson, indexHtml, viteConfig } = generatedCode;

	// 根据文件类型确定扩展名
	const extension = isTypeScript ? ".tsx" : options.framework === "react" ? ".jsx" : ".vue";

	// 创建组件代码文件并下载
	const componentBlob = new Blob([componentCode], { type: "text/plain" });
	const componentUrl = URL.createObjectURL(componentBlob);
	const componentLink = document.createElement("a");
	componentLink.href = componentUrl;
	componentLink.download = `${filename}${extension}`;
	componentLink.click();

	// 如果有样式代码，创建样式文件并下载
	if (styleCode) {
		const styleBlob = new Blob([styleCode], { type: "text/plain" });
		const styleUrl = URL.createObjectURL(styleBlob);
		const styleLink = document.createElement("a");
		styleLink.href = styleUrl;
		styleLink.download = `${filename}.${options.styleType}`;
		styleLink.click();
	}

	// 如果有package.json，创建package.json文件并下载
	if (packageJson) {
		const packageJsonBlob = new Blob([packageJson], { type: "application/json" });
		const packageJsonUrl = URL.createObjectURL(packageJsonBlob);
		const packageJsonLink = document.createElement("a");
		packageJsonLink.href = packageJsonUrl;
		packageJsonLink.download = "package.json";
		packageJsonLink.click();
	}

	// 如果有index.html，创建index.html文件并下载
	if (indexHtml) {
		const indexHtmlBlob = new Blob([indexHtml], { type: "text/html" });
		const indexHtmlUrl = URL.createObjectURL(indexHtmlBlob);
		const indexHtmlLink = document.createElement("a");
		indexHtmlLink.href = indexHtmlUrl;
		indexHtmlLink.download = "index.html";
		indexHtmlLink.click();
	}

	// 如果有vite.config，创建vite.config文件并下载
	if (viteConfig) {
		const viteConfigBlob = new Blob([viteConfig], { type: "text/plain" });
		const viteConfigUrl = URL.createObjectURL(viteConfigBlob);
		const viteConfigLink = document.createElement("a");
		viteConfigLink.href = viteConfigUrl;
		viteConfigLink.download = isTypeScript ? "vite.config.ts" : "vite.config.js";
		viteConfigLink.click();
	}

	// 如果使用TypeScript，创建tsconfig.json文件并下载
	if (isTypeScript) {
		const tsConfig = generateTsConfig();
		const tsConfigBlob = new Blob([tsConfig], { type: "application/json" });
		const tsConfigUrl = URL.createObjectURL(tsConfigBlob);
		const tsConfigLink = document.createElement("a");
		tsConfigLink.href = tsConfigUrl;
		tsConfigLink.download = "tsconfig.json";
		tsConfigLink.click();
	}
}
