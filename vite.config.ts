import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { wrapperEnv } from "./src/utils/getEnv.js";

// 性能优化模块
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";
import importToCDN from "vite-plugin-cdn-import";

// 其余vite插件
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

// @see: https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd());
	const viteEnv = wrapperEnv(env);

	return {
		// base: "/",
		// 插件
		plugins: [
			react(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE,
					},
				},
			}),
			// 是否生成包预览
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip 压缩
			// 代码压缩
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
			viteImagemin({
				gifsicle: { optimizationLevel: 3 }, // GIF 压缩
				mozjpeg: { quality: 75 }, // JPEG 压缩
				pngquant: { quality: [0.8, 0.9] }, // PNG 压缩
				svgo: { plugins: [{ removeViewBox: false }] }, // SVG 压缩
			}),
			// CDN加速
			importToCDN({
				modules: [
					{
						name: "react", // 模块名
						var: "React", // 全局变量名
						path: "https://unpkg.com/react@18/umd/react.development.js", // CDN 地址
					},
					{
						name: "react-dom", // 模块名
						var: "ReactDOM", // 全局变量名
						path: "https://unpkg.com/react-dom@18/umd/react-dom.development.js", // CDN 地址
					},
					{
						name: "react-router-dom", // 模块名
						var: "ReactRouterDOM", // 全局变量名
						path: "https://unpkg.com/react-router-dom@6/dist/react-router-dom.development.js", // CDN 地址
					},
					{
						name: "axios", // 模块名
						var: "axios", // 全局变量名
						path: "https://unpkg.com/axios/dist/axios.min.js", // CDN 地址
					},
					{
						name: "moment", // 模块名
						var: "moment", // 全局变量名
						path: "https://unpkg.com/moment/min/moment.min.js", // CDN 地址
					},
					{
						name: "radash", // 模块名
						var: "radash", // 全局变量名
						path: "https://unpkg.com/radash/dist/radash.min.js", // CDN 地址
					},
				],
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
				external: ["react", "react-dom", "react-router-dom", "axios", "moment", "radash"],
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
				compress: {
					drop_console: true,
					drop_debugger: true,
				},
			},
		},
		// 路径别名
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		// 全局样式
		css: {
			postcss: {
				plugins: [autoprefixer(), tailwindcss],
			},
			preprocessorOptions: {
				less: {
					// 是否允许在less中写js
					javascriptEnabled: true,
					// 每个less文件编译前添加的额外less代码
					additionalData: `@import "@/styles/var.less";`,
				},
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
