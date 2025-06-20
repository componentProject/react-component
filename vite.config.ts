// vite react插件
import pluginReact from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";

// 性能优化模块
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";
import importToCDN from "vite-plugin-cdn-import";
import { modules } from "./src/constants";

// qiankun
import qiankun from "vite-plugin-qiankun";
import scopedCssPrefixPlugin from "./plugins/addScopedAndReplacePrefix";

// tailwind
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/postcss";

// 其余vite插件与配置
import path from "path";
import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "postcss";
import { createHtmlPlugin } from "vite-plugin-html";
import { wrapperEnv } from "./src/utils";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	const appTitle = viteEnv.VITE_GLOB_APP_TITLE;
	const isDev = mode === "development";
	const systemCode = viteEnv.VITE_GLOB_APP_CODE;
	const useDevMode = false;
	const envSystemCode = isDev && !useDevMode ? "el" : viteEnv.VITE_GLOB_APP_CODE;

	const useDoc = viteEnv.VITE_USE_DOCUMENT;

	const reactPlugins = [
		pluginReact(),
		// 自动引入
		AutoImport({
			imports: ["react"],
			dts: path.resolve(__dirname, "./src/typings/auto-imports.d.ts"),
		}),
	].filter((i) => !!i);

	const performancePlugins = [
		createHtmlPlugin({
			inject: {
				data: {
					title: appTitle,
				},
			},
		}),
		// 代码压缩
		viteEnv.VITE_COMPRESS &&
			viteCompression({
				algorithm: viteEnv.VITE_BUILD_GZIP ? "gzip" : "brotliCompress",
				verbose: true,
				disable: false,
				ext: ".gz",
				threshold: 10240,
				deleteOriginFile: false,
			}),
		// 图片压缩
		viteEnv.VITE_IMAGEMIN &&
			viteImagemin({
				gifsicle: { optimizationLevel: 7, interlaced: false },
				optipng: { optimizationLevel: 7 },
				mozjpeg: { quality: 20 },
				pngquant: { quality: [0.8, 0.9], speed: 4 },
				svgo: {
					plugins: [{ name: "removeViewBox" }, { name: "removeEmptyAttrs", active: false }],
				},
			}),
		viteEnv.VITE_USE_CDN &&
			!useDoc &&
			importToCDN({
				enableInDevMode: viteEnv.VITE_USE_CDN_IS_DEV,
				prodUrl: `${viteEnv.VITE_CDN_BASE_URL}/{name}@{version}{path}`,
				modules,
			}),
	].filter((i) => !!i);

	const monitorPlugins = [
		// 是否生成包预览
		viteEnv.VITE_REPORT &&
			visualizer({
				open: true,
			}),
	].filter((i) => !!i);

	const qianKunPlugins =
		viteEnv.VITE_USE_QIANKUN && !useDoc
			? [
					qiankun(envSystemCode, { useDevMode }),
					scopedCssPrefixPlugin({
						prefixScoped: `div[data-qiankun='${envSystemCode}']`,
						oldPrefix: "el",
						newPrefix: systemCode,
						useDevMode,
					}),
				]
			: [];

	return {
		base: `/${systemCode}`,
		plugins: [...reactPlugins, ...performancePlugins, ...monitorPlugins, ...qianKunPlugins],
		esbuild: {
			pure: !isDev && viteEnv.VITE_PURE_CONSOLE_AND_DEBUGGER ? ["console.log", "console.info", "console.debug"] : [],
		},
		// 预构建相关
		optimizeDeps: {
			include: [],
			exclude: [],
		},
		build: {
			sourcemap: isDev,
			outDir: `${systemCode}`,
			cssCodeSplit: true,
			chunkSizeWarningLimit: 1500,
			minify: "esbuild",
			rollupOptions: {
				external: [],
				output: {
					globals: {},
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks: (id: string) => {
						// 优化拆分策略
						if (id.includes("node_modules")) {
							return id.toString().split("node_modules/")[1].split("/")[0].toString();
						}
					},
				},
			},
		},
		define: {
			__SYSTEM_CODE__: JSON.stringify(envSystemCode),
		},
		css: {
			postcss: {
				plugins: [tailwindcss() as Plugin, autoprefixer() as Plugin],
			},
			devSourcemap: isDev,
			preprocessorOptions: {
				scss: {
					api: "modern-compiler",
					additionalData(content: string, filename: string) {
						if (filename.includes("element")) {
							const addStr = `$namespace: ${envSystemCode};`;
							return `${addStr}\n${content}`;
						}
						return content;
					},
				},
			},
		},
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		// 代理配置
		server: {
			host: "0.0.0.0", // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			// https: false,
			// 代理跨域（mock 不需要配置，这里只是个事列）
			proxy: {
				"/translate": {
					target: "https://fanyi-api.baidu.com/api/trans/vip/translate",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/translate/, ""),
				},
			},
		},
	};
});
