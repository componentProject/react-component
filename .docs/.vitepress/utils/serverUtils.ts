import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import path from "path";
import type { PostType } from "./utils.ts";

export async function getComponents(componentPath: string) {
	const paths = await getComponentMDFilePaths(componentPath);
	const posts = (await Promise.all(
		paths.map(async (item) => {
			const content = await fs.readFile(path.join(__dirname, `../..${componentPath}`, item), "utf-8");
			const { data } = matter(content);
			data.date = _convertDate(data.date);
			return {
				frontMatter: data,
				regularPath: `${componentPath}/${item.replace(".md", ".html")}`,
			};
		}),
	)) as PostType[];
	posts.sort(_compareDate);
	return posts;
}

function _convertDate(date = new Date().toString()) {
	const json_date = new Date(date).toJSON();
	return json_date.split("T")[0];
}

function _compareDate(obj1: PostType, obj2: PostType) {
	if (obj1.frontMatter.date && obj2.frontMatter.date) {
		return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1;
	} else {
		return 1;
	}
}

async function getComponentMDFilePaths(componentPath: string) {
	return await globby(["**/*.md"], {
		ignore: ["node_modules", "README.md"],
		cwd: `./.docs${componentPath}`,
	});
}

export async function getComponentLength(componentPath: string) {
	// getComponentMDFilePath return type is object not array
	return [...(await getComponentMDFilePaths(componentPath))].length;
}

console.log("getComponentLength", getComponentLength);
