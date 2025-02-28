import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import type { PluginOption } from "vite";
import viteConfig from "../vite.config";
import type { modeType } from "../vite.config";
import importToCDN from "vite-plugin-cdn-import";

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
	docs: {
		autodocs: true,
	},
};

export default config;
