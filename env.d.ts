/// <reference types="vite/client" />
declare interface ViteEnv {
	/**
	 * 项目标题
	 */
	VITE_GLOB_APP_TITLE: string;
	/**
	 * 项目code
	 */
	VITE_GLOB_APP_CODE: string;
	/**
	 * 是否启用vue-devtools
	 */
	VITE_DEVTOOLS: boolean;
	/**
	 * 是否在打包时，删除console和debugger
	 */
	VITE_PURE_CONSOLE_AND_DEBUGGER: boolean;
	/**
	 * 项目端口
	 */
	VITE_PORT: number;
	/**
	 * 是否在npm run dev时，自动打开浏览器
	 */
	VITE_OPEN: boolean;
	/**
	 * 是否启用sentry监控
	 */
	VITE_SENTRY: boolean;
	/**
	 * 是否启用qiankun
	 */
	VITE_USE_QIANKUN: boolean;
	/**
	 * dev环境是否启用qiankun
	 */
	VITE_QIANKUN_DEV: boolean;
	/**
	 * 是否生成包预览文件
	 */
	VITE_REPORT: boolean;
	/**
	 * 是否压缩代码
	 */
	VITE_COMPRESS: boolean;
	/**
	 * 是否压缩图片
	 */
	VITE_IMAGEMIN: boolean;
	/**
	 * 是否开启文档模式,与CDN，qiankun互斥
	 */
	VITE_USE_DOCUMENT: boolean;
	/**
	 * 是否启用CDN加速 不知道为什么会导致storybook打包会丢失cdn里的包
	 */
	VITE_USE_CDN: boolean;
	/**
	 * dev环境是否启用CDN
	 */
	VITE_USE_CDN_IS_DEV: boolean;
	/**
	 * CDN的基本url
	 */
	VITE_CDN_BASE_URL: string;
	/**
	 * 是否开启gzip压缩,需要先开启压缩代码才有效
	 */
	VITE_BUILD_GZIP: boolean;
	/**
	 * 是否删除生产环境 console
	 */
	VITE_DROP_CONSOLE: boolean;
}

declare const __SYSTEM_CODE__ = string;

declare global {}
