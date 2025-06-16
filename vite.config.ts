import { defineConfig, loadEnv } from "vite";
import type { UserConfig } from "vite";
import { wrapperEnv } from "./src/utils";

// react
// 性能优化模块
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";

// 其余vite插件
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/postcss";
import path from "path";
// storybook不支持这种cdn
// import importToCDN from "vite-plugin-cdn-import";
// import { modules } from "./src/constants";

// @see: https://vitejs.dev/config/
export default defineConfig((mode): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	const appTitle = viteEnv.VITE_GLOB_APP_TITLE;
	const isDev = mode.mode === "development";
	const systemCode = isDev ? "el" : viteEnv.VITE_GLOB_APP_CODE;

	const reactPlugins = [react()].filter((i) => !!i);

	// 性能优化插件
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
				// gzip压缩需要服务器nginx配置以下内容:
				// http {
				//   gzip_static on;
				//   gzip_proxied any;
				// }
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
		// CDN加速（默认关闭）
		// viteEnv.VITE_USE_CDN &&
		// importToCDN({
		// 	enableInDevMode: viteEnv.VITE_USE_CDN_IS_DEV,
		// 	prodUrl: `${viteEnv.VITE_CDN_BASE_URL}/{name}@{version}{path}`,
		// 	modules,
		// }),
	].filter((i) => !!i);

	// 监控插件
	const monitorPlugins = [
		// 是否生成包预览
		viteEnv.VITE_REPORT &&
			visualizer({
				open: true,
			}),
	].filter((i) => !!i);

	return {
		base: systemCode ? `/${systemCode}` : "/",
		plugins: [...reactPlugins, ...performancePlugins, ...monitorPlugins],
		esbuild: {
			pure: !isDev && viteEnv.VITE_PURE_CONSOLE_AND_DEBUGGER ? ["console.log", "console.info", "console.debug"] : [],
		},
		// 预构建相关
		optimizeDeps: {
			include: [],
			exclude: [],
		},
		build: {
			// 启用 CSS 代码拆分,使加载模块时,仅加载对应css,而不是打包为一个样式文件
			sourcemap: isDev,
			cssCodeSplit: true,
			// 关闭 sourcemap
			chunkSizeWarningLimit: 1500,
			minify: "esbuild",
			rollupOptions: {
				external: [],
				output: {
					globals: {},
					// 静态资源打包做处理
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					// 依赖拆分
					manualChunks: (id: string) => {
						// 优化拆分策略
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
		define: {
			__SYSTEM_CODE__: JSON.stringify(systemCode),
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
			devSourcemap: isDev,
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
