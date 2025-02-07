import fs from "fs";
import path from "path";

/**
 * 将.docs目录下的指定目录里所有md文件转成vitepress的sidebar格式
 * @param fileName
 * @param excludePaths
 */

export async function getSidebar(fileName: string, excludePaths: string[] = []) {
	async function getDirectoryStructure(srcPath: string) {
		const items = {};
		const files = fs.readdirSync(srcPath);

		const callbacks = files.map(async (file) => {
			const filePath = path.join(srcPath, file);
			const stat = fs.statSync(filePath);

			if (excludePaths.some((excludePath) => filePath.includes(excludePath))) {
				return;
			}
			if (stat.isDirectory()) {
				items[file] = await getDirectoryStructure(filePath);
			} else {
				// 只处理特定类型的文件，例如 .md
				if (path.extname(file) === ".md") {
					items[file.replace(".md", "")] = filePath;
				}
			}
		});
		await Promise.all(callbacks);
		return items;
	}

	const srcPath = path.join(__dirname, "../..", fileName);

	const sidebarStructure = await getDirectoryStructure(srcPath);

	// 转换sidebarStructure为适合VitePress侧边栏的格式
	function getSidebarItems(sidebarStructure, fileName) {
		return Object.entries(sidebarStructure).reduce((modules, [text, value]) => {
			if (typeof value === "object") {
				modules.push({
					text,
					collapsible: true,
					collapsed: true,
					items: getSidebarItems(value, fileName),
				});
			} else {
				const link = `/${fileName}/${path.relative(srcPath, value).replace(".md", "")}`;
				modules.push({
					activeMatch: link,
					text,
					link,
				});
			}
			return modules;
		}, []);
	}

	return getSidebarItems(sidebarStructure, fileName);
}
