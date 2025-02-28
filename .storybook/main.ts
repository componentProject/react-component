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
		const mergePluginNames: string[] = [];
		const mergePlugins: PluginOptionType[] = [];
		config.plugins.forEach((item?: PluginOptionType) => {
			if (!item) return;
			if (!mergePluginNames.includes(item.name)) {
				mergePluginNames.push(item.name);
				mergePlugins.push(item);
			}
		});
		if (configType === "PRODUCTION") {
			const existingPlugins = [importToCDN].map((item) => item.name);
			config.plugins = mergePlugins.filter((plugin: PluginOptionType) => {
				return !existingPlugins.includes(plugin?.name);
			});
			config.build.rollupOptions.external = config.build.rollupOptions.external.filter(
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
