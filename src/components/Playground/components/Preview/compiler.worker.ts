/**
 * 导入Babel转换工具
 */
import { transform } from "@babel/standalone";
/**
 * 导入文件类型
 */
import { File, Files } from "../../PlaygroundContext.tsx";
/**
 * 导入入口文件名常量
 */
import { ENTRY_FILE_NAME } from "../../files";
/**
 * 导入Babel插件类型
 */
import { PluginObj } from "@babel/core";

/**
 * 转换前预处理代码
 * 
 * 为没有导入React的JSX和TSX文件自动添加React导入
 * @param filename 文件名
 * @param code 源代码
 * @returns 预处理后的代码
 */
export const beforeTransformCode = (filename: string, code: string) => {
	let _code = code;
	const regexReact = /import\s+React/g;
	if ((filename.endsWith(".jsx") || filename.endsWith(".tsx")) && !regexReact.test(code)) {
		_code = `import React from 'react';\n${code}`;
	}
	return _code;
};

/**
 * 使用Babel转换代码
 * 
 * 将TypeScript和React代码转换为标准JavaScript
 * @param filename 文件名
 * @param code 源代码
 * @param files 所有文件
 * @returns 转换后的代码
 */
export const babelTransform = (filename: string, code: string, files: Files) => {
	const _code = beforeTransformCode(filename, code);
	let result = "";
	try {
		result = transform(_code, {
			presets: ["react", "typescript"],
			filename,
			plugins: [customResolver(files)],
			retainLines: true,
		}).code!;
	} catch (e) {
		console.error("编译出错", e);
	}
	return result;
};

/**
 * 根据模块路径获取对应的文件
 * 
 * @param files 所有文件
 * @param modulePath 模块路径
 * @returns 找到的文件对象
 */
const getModuleFile = (files: Files, modulePath: string) => {
	let moduleName = modulePath.split("./").pop() || "";
	if (!moduleName.includes(".")) {
		const realModuleName = Object.keys(files)
			.filter((key) => {
				return key.endsWith(".ts") || key.endsWith(".tsx") || key.endsWith(".js") || key.endsWith(".jsx");
			})
			.find((key) => {
				return key.split(".").includes(moduleName);
			});
		if (realModuleName) {
			moduleName = realModuleName;
		}
	}
	return files[moduleName];
};

/**
 * 将JSON文件转换为JavaScript模块
 * 
 * @param file JSON文件
 * @returns JavaScript模块URL
 */
const json2Js = (file: File) => {
	const js = `export default ${file.value}`;
	return URL.createObjectURL(new Blob([js], { type: "application/javascript" }));
};

/**
 * 将CSS文件转换为JavaScript模块
 * 
 * 创建并注入样式元素
 * @param file CSS文件
 * @returns JavaScript模块URL
 */
const css2Js = (file: File) => {
	const randomId = new Date().getTime();
	const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
    `;
	return URL.createObjectURL(new Blob([js], { type: "application/javascript" }));
};

/**
 * 创建自定义模块解析器插件
 * 
 * 处理相对导入路径，将其替换为转换后的内容URL
 * @param files 所有文件
 * @returns Babel插件对象
 */
function customResolver(files: Files): PluginObj {
	return {
		visitor: {
			ImportDeclaration(path) {
				const modulePath = path.node.source.value;
				if (modulePath.startsWith(".")) {
					const file = getModuleFile(files, modulePath);
					if (!file) return;

					if (file.name.endsWith(".css")) {
						path.node.source.value = css2Js(file);
					} else if (file.name.endsWith(".json")) {
						path.node.source.value = json2Js(file);
					} else {
						path.node.source.value = URL.createObjectURL(
							new Blob([babelTransform(file.name, file.value, files)], {
								type: "application/javascript",
							}),
						);
					}
				}
			},
		},
	};
}

/**
 * 编译所有文件
 * 
 * 从入口文件开始编译整个项目
 * @param files 所有文件
 * @returns 编译后的代码
 */
export const compile = (files: Files) => {
	const main = files[ENTRY_FILE_NAME];
	return babelTransform(ENTRY_FILE_NAME, main.value, files);
};

/**
 * 监听工作线程消息
 * 
 * 接收文件列表，返回编译结果
 */
self.addEventListener("message", async ({ data }) => {
	try {
		self.postMessage({
			type: "COMPILED_CODE",
			data: compile(data),
		});
	} catch (e) {
		self.postMessage({ type: "ERROR", error: e });
	}
});
