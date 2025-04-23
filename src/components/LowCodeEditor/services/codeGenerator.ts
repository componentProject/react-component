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
	/** 组件库 */
	componentLibrary?: "antd" | "shadcn" | "mui" | "element-plus" | "antdv" | "vuetify" | "shadcn-vue";
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
	/** main文件内容 */
	mainFile?: string;
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
 * Element Plus组件映射表
 */
const elementPlusComponentMap: Record<string, { component: string }> = {
	Button: { component: "el-button" },
	Form: { component: "el-form" },
	FormItem: { component: "el-form-item" },
	Input: { component: "el-input" },
	DatePicker: { component: "el-date-picker" },
	Container: { component: "el-container" },
	Table: { component: "el-table" },
	Modal: { component: "el-dialog" },
	Page: { component: "div" },
};

/**
 * Ant Design Vue组件映射表
 */
const antDesignVueComponentMap: Record<string, { component: string }> = {
	Button: { component: "a-button" },
	Form: { component: "a-form" },
	FormItem: { component: "a-form-item" },
	Input: { component: "a-input" },
	DatePicker: { component: "a-date-picker" },
	Container: { component: "a-layout" },
	Table: { component: "a-table" },
	Modal: { component: "a-modal" },
	Page: { component: "div" },
};

/**
 * Vuetify组件映射表
 */
const vuetifyComponentMap: Record<string, { component: string }> = {
	Button: { component: "v-btn" },
	Form: { component: "v-form" },
	FormItem: { component: "v-text-field" },
	Input: { component: "v-text-field" },
	DatePicker: { component: "v-date-picker" },
	Container: { component: "v-container" },
	Table: { component: "v-data-table" },
	Modal: { component: "v-dialog" },
	Page: { component: "div" },
};

/**
 * Material-UI (MUI) 组件映射表
 */
const muiComponentMap: Record<string, { package: string; component: string }> = {
	Button: { package: "@mui/material", component: "Button" },
	Form: { package: "@mui/material", component: "Box" },
	FormItem: { package: "@mui/material", component: "FormControl" },
	Input: { package: "@mui/material", component: "TextField" },
	DatePicker: { package: "@mui/x-date-pickers", component: "DatePicker" },
	Container: { package: "@mui/material", component: "Container" },
	Table: { package: "@mui/material", component: "Table" },
	Modal: { package: "@mui/material", component: "Modal" },
	Page: { package: "@mui/material", component: "Box" },
};

/**
 * Shadcn UI 组件映射表
 */
const shadcnComponentMap: Record<string, { importPath: string; component: string }> = {
	Button: { importPath: "@/components/ui/button", component: "Button" },
	Form: { importPath: "@/components/ui/form", component: "Form" },
	FormItem: { importPath: "@/components/ui/form", component: "FormItem" },
	Input: { importPath: "@/components/ui/input", component: "Input" },
	DatePicker: { importPath: "@/components/ui/date-picker", component: "DatePicker" },
	Container: { importPath: "", component: "div" },
	Table: { importPath: "@/components/ui/table", component: "Table" },
	Modal: { importPath: "@/components/ui/dialog", component: "Dialog" },
	Page: { importPath: "", component: "div" },
};

/**
 * Shadcn Vue 组件映射表
 */
const shadcnVueComponentMap: Record<string, { component: string }> = {
	Button: { component: "SButton" },
	Form: { component: "SForm" },
	FormItem: { component: "SFormItem" },
	Input: { component: "SInput" },
	DatePicker: { component: "SDatePicker" },
	Container: { component: "div" },
	Table: { component: "STable" },
	Modal: { component: "SDialog" },
	Page: { component: "div" },
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
	componentLibrary: "antd", // 默认使用 Ant Design
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
	const shadcnImports = new Set<string>();

	// 递归收集所有组件的导入
	function collectImports(comps: Component[]) {
		comps.forEach((comp) => {
			if (options.componentLibrary === "shadcn") {
				const importInfo = shadcnComponentMap[comp.name];
				if (importInfo && importInfo.importPath) {
					shadcnImports.add(importInfo.importPath);
				}
			} else if (options.componentLibrary === "mui") {
				const importInfo = muiComponentMap[comp.name];
				if (importInfo && importInfo.package) {
					if (!imports.has(importInfo.package)) {
						imports.set(importInfo.package, new Set());
					}
					imports.get(importInfo.package)?.add(importInfo.component);
				}
			} else {
				// 默认使用antd
				const importInfo = componentImportMap[comp.name];
				if (importInfo && importInfo.package) {
					if (!imports.has(importInfo.package)) {
						imports.set(importInfo.package, new Set());
					}
					imports.get(importInfo.package)?.add(importInfo.component);
				}
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

	// 根据组件库生成不同的导入语句
	if (options.componentLibrary === "shadcn") {
		// Shadcn UI 导入 - 每个组件从单独的文件导入
		shadcnImports.forEach((importPath) => {
			if (importPath) {
				importCode += `import { ${
					shadcnComponentMap[
						Object.keys(shadcnComponentMap).find((key) => shadcnComponentMap[key].importPath === importPath) || ""
					].component
				} } from '${importPath}';\n`;
			}
		});
	} else if (options.componentLibrary === "mui") {
		// MUI 导入
		imports.forEach((components, packageName) => {
			importCode += `import { ${Array.from(components).join(", ")} } from '${packageName}';\n`;
		});

		// 导入 MUI 主题和样式
		importCode += "import { ThemeProvider, createTheme } from '@mui/material/styles';\n";
		importCode += "import CssBaseline from '@mui/material/CssBaseline';\n";
	} else {
		// Ant Design 或默认导入
		imports.forEach((components, packageName) => {
			importCode += `import { ${Array.from(components).join(", ")} } from '${packageName}';\n`;
		});
	}

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
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} JSX代码
 */
function generateComponentJSX(component: Component, indentLevel = 0, options: CodeGeneratorOptions): string {
	const indent = "  ".repeat(indentLevel);
	const componentConfig = useComponentConfigStore.getState().componentConfig[component.name];

	if (!componentConfig) {
		return `${indent}/* 未找到组件配置: ${component.name} */`;
	}

	// 获取组件映射信息
	let ComponentName = "";

	if (options.componentLibrary === "shadcn") {
		const importInfo = shadcnComponentMap[component.name];
		ComponentName = importInfo ? importInfo.component : component.name;
	} else if (options.componentLibrary === "mui") {
		const importInfo = muiComponentMap[component.name];
		ComponentName = importInfo ? importInfo.component : component.name;
	} else {
		// 默认使用 antd
		const importInfo = componentImportMap[component.name];
		ComponentName = importInfo ? importInfo.component : component.name;
	}

	// 合并默认属性和用户配置的属性
	const props = { ...componentConfig.defaultProps, ...component.props };

	// 生成属性字符串
	let propsString = "";
	Object.entries(props).forEach(([key, value]) => {
		// 跳过children和内部使用的属性
		if (key === "children" || key === "id" || key === "name" || key === "desc") return;

		// 根据不同组件库处理属性
		if (options.componentLibrary === "shadcn") {
			// Shadcn 使用标准的 React 属性格式
			if (typeof value === "string") {
				propsString += ` ${key}="${value}"`;
			} else if (typeof value === "number" || typeof value === "boolean") {
				propsString += ` ${key}={${value}}`;
			} else if (value !== null && typeof value === "object") {
				propsString += ` ${key}={${JSON.stringify(value)}}`;
			}
		} else if (options.componentLibrary === "mui") {
			// MUI 可能使用特殊的属性名称
			const muiKey = key === "text" ? "label" : key; // 例如，将text属性映射为label
			if (typeof value === "string") {
				propsString += ` ${muiKey}="${value}"`;
			} else if (typeof value === "number" || typeof value === "boolean") {
				propsString += ` ${muiKey}={${value}}`;
			} else if (value !== null && typeof value === "object") {
				propsString += ` ${muiKey}={${JSON.stringify(value)}}`;
			}
		} else {
			// Ant Design 或默认的处理方式
			if (typeof value === "string") {
				propsString += ` ${key}="${value}"`;
			} else if (typeof value === "number" || typeof value === "boolean") {
				propsString += ` ${key}={${value}}`;
			} else if (value !== null && typeof value === "object") {
				propsString += ` ${key}={${JSON.stringify(value)}}`;
			}
		}
	});

	// 添加样式类名
	const className = `${component.name.toLowerCase()}-${component.id}`;

	// 根据组件库调整类名
	if (options.componentLibrary === "mui") {
		propsString += ` className="${className}"`;
	} else if (options.componentLibrary === "shadcn") {
		// shadcn 通常使用 className 属性带有预设的类名
		propsString += ` className="${className}"`;
	} else {
		propsString += ` className="${className}"`;
	}

	// 生成内联样式
	if (component.styles) {
		const styleObj = JSON.stringify(component.styles).replace(/"/g, "'").replace(/,/g, ", ");

		if (options.componentLibrary === "mui") {
			// MUI 可以使用 sx 属性
			propsString += ` sx={${styleObj}}`;
		} else {
			propsString += ` style={${styleObj}}`;
		}
	}

	// 处理子组件
	let childrenJSX = "";
	if (component.children && component.children.length > 0) {
		childrenJSX = component.children.map((child) => generateComponentJSX(child, indentLevel + 1, options)).join("\n");

		// 返回带有子组件的JSX
		return `${indent}<${ComponentName}${propsString}>\n${childrenJSX}\n${indent}</${ComponentName}>`;
	}

	// 处理文本内容
	if (props.text) {
		// 不同组件库处理文本的方式可能不同
		if (options.componentLibrary === "mui" && ["Button", "TextField"].includes(component.name)) {
			// MUI 的某些组件使用 children 或特殊属性来显示文本
			return `${indent}<${ComponentName}${propsString}>${props.text}</${ComponentName}>`;
		} else if (options.componentLibrary === "shadcn") {
			return `${indent}<${ComponentName}${propsString}>${props.text}</${ComponentName}>`;
		} else {
			return `${indent}<${ComponentName}${propsString}>${props.text}</${ComponentName}>`;
		}
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
		jsxCode += generateComponentJSX(component, 0, options);
	});

	const isTypeScript = options.fileType === "tsx";

	// 根据组件库生成不同的包装代码
	if (options.componentLibrary === "mui") {
		return `${imports}
${isTypeScript ? `interface ${componentName}Props {}\n` : ""}
function ${componentName}(${isTypeScript ? "props: " + componentName + "Props" : "props"}) {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
${jsxCode}
    </ThemeProvider>
  );
}

export default ${componentName};
`;
	} else {
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

	// 根据选择的库生成导入语句
	if (options.componentLibrary === "element-plus") {
		importCode += "import { createApp } from 'vue';\n";
		importCode += "import ElementPlus from 'element-plus';\n";
		importCode += "import 'element-plus/dist/index.css';\n";
	} else if (options.componentLibrary === "antdv") {
		importCode += "import { createApp } from 'vue';\n";
		importCode += "import Antd from 'ant-design-vue';\n";
		importCode += "import 'ant-design-vue/dist/antd.css';\n";
	} else if (options.componentLibrary === "vuetify") {
		importCode += "import { createApp } from 'vue';\n";
		importCode += "import { createVuetify } from 'vuetify';\n";
		importCode += "import 'vuetify/styles';\n";
	} else if (options.componentLibrary === "shadcn-vue") {
		importCode += "import { createApp } from 'vue';\n";
		importCode += "// 导入Shadcn Vue组件\n";
		importCode += "import { SButton, SInput, SForm, SFormItem } from '@shadcn/vue';\n";
		importCode += "import '@shadcn/vue/styles.css';\n";
	}

	// 选择合适的组件映射表
	const componentMap =
		options.componentLibrary === "element-plus"
			? elementPlusComponentMap
			: options.componentLibrary === "antdv"
				? antDesignVueComponentMap
				: options.componentLibrary === "vuetify"
					? vuetifyComponentMap
					: options.componentLibrary === "shadcn-vue"
						? shadcnVueComponentMap
						: elementPlusComponentMap; // 默认使用 Element Plus

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

			// 使用选定的组件库组件
			const elementTag = componentMap[comp.name]?.component || comp.name.toLowerCase();

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
				template += `${indent}<${elementTag}${propsString}>\n${childrenTemplate}${indent}</${elementTag}>\n`;
			} else if (props.text) {
				// 处理文本内容
				template += `${indent}<${elementTag}${propsString}>${props.text}</${elementTag}>\n`;
			} else {
				// 返回自闭合组件
				template += `${indent}<${elementTag}${propsString} />\n`;
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

	// 生成合适的脚本内容
	let scriptContent = "";

	if (options.componentLibrary === "element-plus") {
		scriptContent = `import { ref, onMounted } from 'vue'
// 导入Element Plus相关组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 组件名称
const componentName = '${componentName}'

// 组件数据
const data = ref({})

// 组件挂载后执行
onMounted(() => {
  console.log('${componentName} 组件已挂载')
})`;
	} else if (options.componentLibrary === "antdv") {
		scriptContent = `import { ref, onMounted } from 'vue'
// 导入Ant Design Vue相关组件
import { ${components
			.map((c) => antDesignVueComponentMap[c.name]?.component.replace("a-", "") || "")
			.filter(Boolean)
			.join(", ")} } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

// 组件名称
const componentName = '${componentName}'

// 组件数据
const data = ref({})

// 组件挂载后执行
onMounted(() => {
  console.log('${componentName} 组件已挂载')
})`;
	} else if (options.componentLibrary === "vuetify") {
		scriptContent = `import { ref, onMounted } from 'vue'
// 导入Vuetify相关组件
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// 组件名称
const componentName = '${componentName}'

// 组件数据
const data = ref({})

// 创建Vuetify实例
const vuetify = createVuetify()

// 组件挂载后执行
onMounted(() => {
  console.log('${componentName} 组件已挂载')
})`;
	} else if (options.componentLibrary === "shadcn-vue") {
		scriptContent = `import { ref, onMounted } from 'vue'
// 导入Shadcn Vue相关组件
import { SButton, SInput, SForm, SFormItem } from '@shadcn/vue'

// 组件名称
const componentName = '${componentName}'

// 组件数据
const data = ref({})

// 组件挂载后执行
onMounted(() => {
  console.log('${componentName} 组件已挂载')
})`;
	} else {
		// 默认 Element Plus
		scriptContent = `import { ref, onMounted } from 'vue'
// 导入Element Plus相关组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 组件名称
const componentName = '${componentName}'

// 组件数据
const data = ref({})

// 组件挂载后执行
onMounted(() => {
  console.log('${componentName} 组件已挂载')
})`;
	}

	// 返回完整的Vue单文件组件
	return `<template>
${template}
</template>

<script ${scriptType} setup>
${scriptContent}
</script>

<style scoped>
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

	// 如果是Vue框架，使用Vue相关依赖
	if (options.framework === "vue") {
		// 清除React依赖
		delete dependencies.react;
		delete dependencies["react-dom"];
		delete devDependencies["@types/react"];
		delete devDependencies["@types/react-dom"];

		// 添加Vue基础依赖
		dependencies.vue = "^3.3.4";
		devDependencies["@vitejs/plugin-vue"] = "^4.2.3";

		// 添加选择的Vue组件库
		if (options.componentLibrary === "element-plus") {
			dependencies["element-plus"] = "^2.3.8";
		} else if (options.componentLibrary === "antdv") {
			dependencies["ant-design-vue"] = "^4.0.0";
		} else if (options.componentLibrary === "vuetify") {
			dependencies.vuetify = "^3.3.0";
		} else if (options.componentLibrary === "shadcn-vue") {
			dependencies["@shadcn/vue"] = "^0.1.0"; // 假设的包名和版本
			dependencies.tailwindcss = "^3.3.3";
			devDependencies.autoprefixer = "^10.4.14";
			devDependencies.postcss = "^8.4.27";
		} else {
			// 默认使用Element Plus
			dependencies["element-plus"] = "^2.3.8";
		}

		// 如果是TypeScript项目
		if (options.fileType === "tsx") {
			devDependencies["vue-tsc"] = "^1.8.5";
		}
	} else {
		// React项目，根据组件库添加依赖
		if (options.componentLibrary === "antd") {
			dependencies.antd = "^5.8.0";
		} else if (options.componentLibrary === "mui") {
			dependencies["@mui/material"] = "^5.14.0";
			dependencies["@mui/icons-material"] = "^5.14.0";
			dependencies["@emotion/react"] = "^11.11.1";
			dependencies["@emotion/styled"] = "^11.11.0";
			if (options.fileType === "tsx") {
				devDependencies["@types/react"] = "^18.2.15";
			}
		} else if (options.componentLibrary === "shadcn") {
			dependencies["class-variance-authority"] = "^0.7.0";
			dependencies.clsx = "^2.0.0";
			dependencies["tailwind-merge"] = "^1.14.0";
			dependencies["tailwindcss-animate"] = "^1.0.6";
			devDependencies.tailwindcss = "^3.3.3";
			devDependencies.autoprefixer = "^10.4.14";
			devDependencies.postcss = "^8.4.27";
		}

		// React TypeScript项目
		if (options.fileType === "tsx") {
			devDependencies.typescript = "^5.0.2";
			devDependencies["@typescript-eslint/eslint-plugin"] = "^6.0.0";
			devDependencies["@typescript-eslint/parser"] = "^6.0.0";
		}
	}

	// 递归收集所有组件的依赖
	function collectDependencies(comps: Component[]) {
		comps.forEach((comp) => {
			if (options.framework === "react" && options.componentLibrary !== "mui" && options.componentLibrary !== "shadcn") {
				const importInfo = componentImportMap[comp.name];
				if (importInfo && importInfo.package && importInfo.package !== "") {
					dependencies[importInfo.package] = "*"; // 实际项目中应指定具体版本
				}
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
		devDependencies.sass = "^1.63.6";
	} else if (options.styleType === "less") {
		devDependencies.less = "^4.1.3";
	} else if (options.styleType === "styled-components" && options.framework === "react") {
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
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} index.html内容
 */
function generateIndexHtml(componentName: string, options: CodeGeneratorOptions = defaultOptions): string {
	if (options.framework === "vue") {
		return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${componentName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;
	} else {
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
}

/**
 * 生成Vue主入口文件代码
 * @param {string} componentName - 组件名称
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} main文件代码
 */
function generateVueMainFile(componentName: string, options: CodeGeneratorOptions): string {
	const isTypeScript = options.fileType === "tsx";
	const extension = isTypeScript ? ".vue" : ".vue";
	const mainExt = isTypeScript ? ".ts" : ".js";

	if (options.componentLibrary === "element-plus") {
		return `import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './${componentName}${extension}'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
`;
	} else if (options.componentLibrary === "antdv") {
		return `import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './${componentName}${extension}'

const app = createApp(App)

app.use(Antd)
app.mount('#app')
`;
	} else if (options.componentLibrary === "vuetify") {
		return `import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import App from './${componentName}${extension}'

const vuetify = createVuetify()
const app = createApp(App)

app.use(vuetify)
app.mount('#app')
`;
	} else if (options.componentLibrary === "shadcn-vue") {
		return `import { createApp } from 'vue'
import { createShadcn } from '@shadcn/vue'
import '@shadcn/vue/styles.css'
import App from './${componentName}${extension}'

const app = createApp(App)
const shadcn = createShadcn()

app.use(shadcn)
app.mount('#app')
`;
	} else {
		// 默认使用 Element Plus
		return `import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './${componentName}${extension}'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
`;
	}
}

/**
 * 生成vite.config.ts文件
 * @param {CodeGeneratorOptions} options - 生成选项
 * @returns {string} vite.config.ts内容
 */
function generateViteConfig(options: CodeGeneratorOptions): string {
	const isTypeScript = options.fileType === "tsx";
	const extension = isTypeScript ? "ts" : "js";

	// 根据框架选择不同的配置
	if (options.framework === "vue") {
		return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})`;
	} else {
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
		// Vue组件样式包含在单文件组件中
		mainCode = generateVueMainFile(componentName, mergedOptions);
	}

	// 生成package.json
	if (mergedOptions.generatePackageJson) {
		packageJson = generatePackageJson(components, mergedOptions);
	}

	// 生成项目配置文件
	if (mergedOptions.generateProjectFiles) {
		indexHtml = generateIndexHtml(componentName, mergedOptions);
		viteConfig = generateViteConfig(mergedOptions);
	}

	return {
		componentCode,
		styleCode: mergedOptions.generateCSS && mergedOptions.framework !== "vue" ? styleCode : undefined,
		isTypeScript: mergedOptions.fileType === "tsx",
		packageJson: mergedOptions.generatePackageJson ? packageJson : undefined,
		indexHtml: mergedOptions.generateProjectFiles ? indexHtml : undefined,
		viteConfig: mergedOptions.generateProjectFiles ? viteConfig : undefined,
		mainFile: mainCode,
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
	const { componentCode, styleCode, isTypeScript, packageJson, indexHtml, viteConfig, mainFile } = generatedCode;
	const mergedOptions = { ...defaultOptions, ...options };

	// 根据文件类型确定扩展名
	const extension = isTypeScript
		? mergedOptions.framework === "vue"
			? ".vue"
			: ".tsx"
		: mergedOptions.framework === "vue"
			? ".vue"
			: ".jsx";

	// 创建组件代码文件并下载
	const componentBlob = new Blob([componentCode], { type: "text/plain" });
	const componentUrl = URL.createObjectURL(componentBlob);
	const componentLink = document.createElement("a");
	componentLink.href = componentUrl;
	componentLink.download = `${filename}${extension}`;
	componentLink.click();

	// 如果有主入口文件，创建主入口文件并下载
	if (mainFile) {
		const mainExtension = isTypeScript
			? mergedOptions.framework === "vue"
				? ".ts"
				: ".tsx"
			: mergedOptions.framework === "vue"
				? ".js"
				: ".jsx";

		const mainBlob = new Blob([mainFile], { type: "text/plain" });
		const mainUrl = URL.createObjectURL(mainBlob);
		const mainLink = document.createElement("a");
		mainLink.href = mainUrl;
		mainLink.download = `main${mainExtension}`;
		mainLink.click();
	}

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
