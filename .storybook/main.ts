import type { StorybookConfig } from "@storybook/react-vite";

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
		config.server.proxy = {
			"/translate": {
				target: "https://fanyi-api.baidu.com/api/trans/vip/translate",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/translate/, ""),
			},
		};
		return config;
	},
	docs: {
		autodocs: true,
	},
};

export default config;
