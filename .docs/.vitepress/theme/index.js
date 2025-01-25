import DefaultTheme from "vitepress/theme";

import "@/assets/styles/main.css";

export default {
	...DefaultTheme,
	NotFound: () => "404",
};
