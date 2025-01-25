import fs from "fs";
import path from "path";

export function getSidebar(fileName: string) {
	const getDirectoryStructure = (srcPath: string) => {
		const items = {};
		const files = fs.readdirSync(srcPath);

		files.forEach((file) => {
			const filePath = path.join(srcPath, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				items[file] = getDirectoryStructure(filePath);
			} else {
				// 只处理特定类型的文件，例如 .md
				if (path.extname(file) === ".md") {
					items[file.replace(".md", "")] = filePath;
				}
			}
		});

		return items;
	};

	const srcPath = path.join(__dirname, "../..", fileName);
	const sidebarStructure = getDirectoryStructure(srcPath);

	// 转换sidebarStructure为适合VitePress侧边栏的格式
	function getSidebarItems(sidebarStructure, fileName) {
		return Object.entries(sidebarStructure).reduce((modules, [key, value]) => {
			if (key === "index") {
				return modules;
			} else if (typeof value === "object") {
				modules.push({
					text: key,
					collapsible: true,
					collapsed: true,
					items: getSidebarItems(value, `${fileName}/${key}`),
				});
			} else {
				modules.push({
					text: key,
					link: `${fileName}/${path.relative(srcPath, value).replace(".md", "")}`,
				});
			}
			return modules;
		}, []);
	}

	const sidebar = getSidebarItems(sidebarStructure, fileName);
	console.log("sidebar", sidebar);
	return sidebar;
}
