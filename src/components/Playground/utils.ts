/**
 * 导入压缩和解压缩库
 */
import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
/**
 * 导入文件类型
 */
import { Files } from "@/components/Playground/PlaygroundContext.tsx";
/**
 * 导入Zip文件处理库
 */
import JSZip from "jszip";
/**
 * 导入文件保存库
 */
import { saveAs } from "file-saver";

/**
 * 根据文件名后缀获取对应的编程语言
 * @param name 文件名
 * @returns 编程语言标识
 */
export const fileName2Language = (name: string) => {
	const suffix = name.split(".").pop() || "";
	if (["js", "jsx"].includes(suffix)) return "javascript";
	if (["ts", "tsx"].includes(suffix)) return "typescript";
	if (["json"].includes(suffix)) return "json";
	if (["css"].includes(suffix)) return "css";
	return "javascript";
};

/**
 * 压缩字符串数据为base64格式
 * @param data 要压缩的字符串
 * @returns 压缩后的base64字符串
 */
export function compress(data: string): string {
	const buffer = strToU8(data);
	const zipped = zlibSync(buffer, { level: 9 });
	const str = strFromU8(zipped, true);
	return btoa(str);
}

/**
 * 解压缩base64格式的字符串
 * @param base64 压缩的base64字符串
 * @returns 解压后的原始字符串
 */
export function uncompress(base64: string): string {
	const binary = atob(base64);

	const buffer = strToU8(binary, true);
	const unzipped = unzlibSync(buffer);
	return strFromU8(unzipped);
}

/**
 * 将文件列表打包下载为zip文件
 * @param files 要下载的文件列表
 */
export async function downloadFiles(files: Files) {
	const zip = new JSZip();

	Object.keys(files).forEach((name) => {
		zip.file(name, files[name].value);
	});

	const blob = await zip.generateAsync({ type: "blob" });
	saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`);
}
