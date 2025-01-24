import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "reactComponent",
	description: "一个react组件库",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		// 标题
		siteTitle: "vueComponent",
		// logo
		logo: `https://vuejs.org/images/logo.png`,
		// 导航栏
		nav: [
			// 单层级
			{ text: "Home", link: "/" },
			// 多层级
			{
				text: "examples",
				items: [
					{
						text: "markdown-examples",
						items: [{ text: "markdown-examples", link: "/markdown-examples" }],
					},
				],
			},
		],

		// 侧边栏,配置基本同导航栏
		sidebar: [
			// 单层级
			{
				text: "Home",
				link: "/",
				// 是否可折叠
				collapsed: false,
			},
			// 多层级
			{
				text: "examples",
				items: [
					{
						text: "markdown-examples",
						items: [{ text: "markdown-examples", link: "/markdown-examples" }],
					},
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
		// 搜索配置
		search: {
			// local or algolia
			// provider: 'local'
			//#region algolia
			provider: "algolia",
			options: {
				appId: "U30ELOTLE6",
				apiKey: "b6db2a4a0256519acf2e1d3408781856",
				indexName: "vueComponent",
			},
			//#endregion
		},
	},
});
