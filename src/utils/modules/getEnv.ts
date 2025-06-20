import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function isDevFn(mode: string): boolean {
	return mode === "development";
}

export function isProdFn(mode: string): boolean {
	return mode === "production";
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
	return process.env.VITE_REPORT === "true";
}

/**
 * 将环境变量中的字符串值转换为对应的 JavaScript 数据类型
 */
export function wrapperEnv(env: Record<string, string>) {
	const result: Record<string, any> = {};

	for (const key in env) {
		if (Object.prototype.hasOwnProperty.call(env, key)) {
			const value = env[key].trim();

			// 处理布尔值
			if (value === "true" || value === "false") {
				result[key] = value === "true";
			}
			// 处理数值
			else if (!isNaN(Number(value))) {
				result[key] = Number(value);
			}
			// 处理空字符串
			else if (value === "") {
				result[key] = null;
			}
			// 其他情况保留原始字符串
			else {
				result[key] = value;
			}
		}
	}

	return result;
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = "VITE_GLOB_", confFiles = [".env", ".env.production"]) {
	let envConfig = {};
	confFiles.forEach((item) => {
		try {
			const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
			envConfig = { ...envConfig, ...env };
		} catch (error) {
			console.error(`Error in parsing ${item}`, error);
		}
	});

	Object.keys(envConfig).forEach((key) => {
		const reg = new RegExp(`^(${match})`);
		if (!reg.test(key)) {
			Reflect.deleteProperty(envConfig, key);
		}
	});
	return envConfig;
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
	return path.resolve(process.cwd(), ...dir);
}
