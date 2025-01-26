import Theme from "vitepress/theme";
import Archives from "./components/Archives.vue";
import Tags from "./components/Tags.vue";
import Layout from "./components/layout/index.vue";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";

import "./custom.css";
import "@/assets/styles/tailwind.scss";

import "vitepress-theme-demoblock/dist/theme/styles/index.css";
import Demo from "vitepress-theme-demoblock/dist/client/components/Demo.vue";
import DemoBlock from "vitepress-theme-demoblock/dist/client/components/DemoBlock.vue";

export default {
	extends: Theme,
	Layout,
	enhanceApp({ app }: EnhanceAppContext) {
		app.component("Archives", Archives);
		app.component("Tags", Tags);
		app.use(TwoslashFloatingVue);

		app.component("Demo", Demo);
		app.component("DemoBlock", DemoBlock);
	},
};
