import { defineConfig, loadEnv } from "vite";
import type { UserConfig } from "vite";
import { wrapperEnv } from "./src/utils/getEnv.ts";

// react
import AutoImport from "unplugin-auto-import/vite";
// 性能优化模块
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";
import importToCDN from "vite-plugin-cdn-import";

// 其余vite插件
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/postcss";
import path from "path";
import { external, modules } from "./src/constants";
// @see: https://vitejs.dev/config/
export default defineConfig((mode): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	const reactPlugins = [
		react(), // 自动引入
		AutoImport({
			imports: ["react"],
			resolvers: [],
			dts: path.resolve(__dirname, "./src/typings/auto-imports.d.ts"),
		}),
	];
	// CDN加速
	const importToCDNPlugins = viteEnv.VITE_USE_CDN
		? importToCDN({
				modules,
			})
		: [];
	return {
		// base: "/",
		// 插件
		plugins: [
			...reactPlugins,
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE,
					},
				},
			}),
			...importToCDNPlugins,
			// 是否生成包预览
			viteEnv.VITE_REPORT && visualizer(),
			// 代码压缩
			viteEnv.VITE_COMPRESS &&
				viteCompression({
					// gzip压缩需要服务器nginx配置以下内容:
					// http {
					//   gzip_static on;
					//   gzip_proxied any;
					// }
					// 可选 'brotliCompress' 或 'gzip'
					algorithm: viteEnv.VITE_BUILD_GZIP ? "gzip" : "brotliCompress",
					verbose: true, //输出日志信息
					disable: false, //是否禁用
					ext: ".gz", // 压缩文件后缀
					threshold: 10240, // 仅压缩大于 10KB 的文件
					deleteOriginFile: false, // 是否删除原始文件
				}),
			// 图片压缩
			viteEnv.VITE_IMAGEMIN &&
				viteImagemin({
					// gif压缩
					gifsicle: {
						optimizationLevel: 7,
						interlaced: false,
					},
					optipng: {
						optimizationLevel: 7,
					},
					mozjpeg: {
						quality: 20,
					},
					pngquant: {
						quality: [0.8, 0.9],
						speed: 4,
					},
					// svg压缩
					svgo: {
						plugins: [
							{
								name: "removeViewBox",
							},
							{
								name: "removeEmptyAttrs",
								active: false,
							},
						],
					},
				}),
		],
		build: {
			// 启用 CSS 代码拆分,使加载模块时,仅加载对应css,而不是打包为一个样式文件
			cssCodeSplit: true,
			// 关闭 sourcemap
			sourcemap: false,
			// 大资源拆分
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				// 移除cdn引入的包
				external: viteEnv.VITE_USE_CDN ? external : [],
				output: {
					// 静态资源打包做处理
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					// 依赖拆分
					manualChunks(id) {
						if (id.includes("node_modules")) {
							return id.toString().split("node_modules/")[1].split("/")[0].toString();
						}
					},
				},
			},
			terserOptions: {
				compress: viteEnv.VITE_DROP_CONSOLE
					? {
							drop_console: true,
							drop_debugger: true,
						}
					: {},
			},
		},
		// 路径别名
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		// 全局样式
		css: {
			postcss: {
				plugins: [
					// 自动添加厂商前缀
					autoprefixer(),
					tailwindcss(),
				],
			},
			preprocessorOptions: {
				scss: { api: "modern-compiler" },
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
			proxy: {},
		},
	};
});
