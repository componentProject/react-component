import type { StorybookConfig } from "@storybook/react-vite";
import type { PluginOption } from "vite";
import importToCDN from "vite-plugin-cdn-import";
import { external } from "../src/constants";

type PluginOptionType = PluginOption & {
	name?: string;
};
const config: StorybookConfig = {
	stories: ["./.stories/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-storysource"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	core: {
		builder: "@storybook/builder-vite",
	},
	async viteFinal(config, { configType }) {
		const existingPlugins = [...importToCDN({ modules: [] })].map((item) => item.name);
		config.plugins = config.plugins.filter((plugin: PluginOptionType) => {
			return !existingPlugins.includes(plugin?.name);
		});
		config.server.proxy = {
			"/translate": {
				target: "https://fanyi-api.baidu.com/api/trans/vip/translate",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/translate/, ""),
			},
		};
		if (configType === "PRODUCTION") {
			config.build.rollupOptions.external = (config.build.rollupOptions.external as string[]).filter(
				(item: string) => !external.includes(item),
			);
		}
		return config;
	},
	docs: {
		autodocs: true,
	},
};

export default config;
