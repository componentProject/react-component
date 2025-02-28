import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import type { PluginOption } from "vite";
import viteConfig from "../vite.config";
import type { modeType } from "../vite.config";

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
		const { plugins, build } = viteConfig({ mode: configType, type: "storybook" } as modeType);
		const mergeconfig = mergeConfig(config, {
			build,
			plugins,
		});
		mergeconfig.plugins = mergeconfig.plugins.filter((plugin: PluginOptionType) => {
			return plugin?.name != "vite-plugin-cdn-import";
		});
		return config;
	},
	docs: {
		autodocs: true,
	},
};

export default config;
