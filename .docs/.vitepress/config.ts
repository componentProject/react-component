import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
// https://github.com/mingyuLi97/blog
// https://vitepress.dev/reference/site-config
import { getSidebar } from "./utils";

export default defineConfig({
	title: "reactComponent",
	description: "一个react组件库",
	base: "/react-component/vitepress/",
	lang: "zh-CN",
	outDir: "../docs/vitepress",
	vite: {
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("../../src", import.meta.url)),
			},
		},
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		// 标题
		siteTitle: "reactComponent",
		// logo
		logo: `https://vuejs.org/images/logo.png`,
		logoLink: "https://vuejs.org/",
		// 导航栏
		nav: [
			// 单层级
			{ text: "首页", link: "/" },
			// 多层级
			{
				text: "基础组件",
				items: getSidebar("examples"),
			},
		],

		// 侧边栏,配置基本同导航栏
		sidebar: {
			"/guild/": [
				{
					text: "指南",
					items: getSidebar("guild"),
				},
			],
			"/examples/": [
				{
					text: "基础组件",
					items: getSidebar("examples"),
				},
			],
		},
		// sidebar: [
		//   {
		//     text: '指南',
		//     link: '/guild/',
		//     items: [
		//       {
		//         text: '配置化表单',
		//         link: '/guild/configForm',
		//       },
		//     ],
		//   },
		//   {
		//     text: '基础组件',
		//     link: '/examples/',
		//     items: [{}],
		//   },
		// ],

		socialLinks: [{ icon: "github", link: "https://github.com/componentProject/vue-component" }],
		// 搜索配置
		search: {
			// local or algolia
			// provider: 'local'
			//#region algolia
			// algolia有两种方式,使用Crawler爬虫,或者github的DocSearch Scraper Action
			// 参考https://juejin.cn/post/7157340749065895944
			provider: "algolia",
			options: {
				appId: "DDD3D6CGWQ",
				apiKey: "3b7df1c9bcf3d1c31fa74e9707936af5",
				indexName: "vueComponent",
			},
			//#endregion
		},
	},
});
