import {defineConfig, loadEnv, ConfigEnv, UserConfig} from "vite";
import react from "@vitejs/plugin-react";
import {resolve} from "path";
import {wrapperEnv} from "./src/utils/getEnv";
import {visualizer} from "rollup-plugin-visualizer";
import {createHtmlPlugin} from "vite-plugin-html";
import viteCompression from "vite-plugin-compression";
// eslint-disable-next-line
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint';

// @see: https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd());
	const viteEnv = wrapperEnv(env);

	return {
		// base: "/",
		// 路径别名
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src")
			}
		},
		// 全局样式
		css: {
			preprocessorOptions: {
				less: {
					// 是否允许在less中写js
					javascriptEnabled: true,
					// 每个less文件编译前添加的额外less代码
					additionalData: `@import "@/styles/var.less";`
				}
			}
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
				"/api": {
					// target: "https://mock.mengxuegu.com/mock/62abda3212c1416424630a45", // easymock
					target: "http://192.168.211.180/ts-system", // easymock
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, "")
				}
			}
		},
		// 插件
		plugins: [
			react(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			// * EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),
			// * 是否生成包预览
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip 压缩
			viteEnv.VITE_BUILD_GZIP &&
			viteCompression({
				verbose: true,
				disable: false,
				threshold: 10240,
				algorithm: "gzip",
				ext: ".gz"
			})
		],
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		build: {
			outDir: "dist",
			// esbuild 打包更快
			minify: "esbuild",
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			rollupOptions: {
				output: {
					// 静态资源分类打包
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});
