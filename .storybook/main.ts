import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import viteConfig from "../vite.config";
import type { modeType } from "../vite.config";
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
		return config;
		// const { plugins, build } = viteConfig({ mode: configType, type: "storybook" } as modeType);
		// return mergeConfig(config, {
		// 	build,
		// 	plugins,
		// });
	},
	docs: {
		autodocs: true,
	},
};

export default config;
