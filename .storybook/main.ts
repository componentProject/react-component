import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import type { PluginOption, ConfigEnv } from "vite";
import viteConfig from "../vite.config";
import importToCDN from "vite-plugin-cdn-import";
import { external } from "../src/constants";
type PluginOptionType = PluginOption & {
	name?: string;
};
interface modeType extends ConfigEnv {
	type: string;
}
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
		const { plugins, build } = viteConfig({ mode: configType, type: "storybook" } as modeType);
		const mergeconfig = mergeConfig(config, {
			build,
			plugins,
		});
		const existingPlugins = [importToCDN].map((item) => item.name);
		const mergePluginNames: string[] = [];
		const mergePlugins: PluginOptionType[] = [];
		mergeconfig.plugins.forEach((item?: PluginOptionType) => {
			if (!item) return;
			if (!mergePluginNames.includes(item.name)) {
				mergePluginNames.push(item.name);
				mergePlugins.push(item);
			}
		});
		mergeconfig.plugins = mergePlugins.filter((plugin: PluginOptionType) => {
			return !existingPlugins.includes(plugin?.name);
		});
		mergeconfig.build.rollupOptions.external = mergeconfig.build.rollupOptions.external.filter(
			(item: string) => !external.includes(item),
		);
		console.log("mergeconfig", mergeconfig.build);
		return mergeconfig;
	},
	docs: {
		autodocs: true,
	},
};

export default config;
