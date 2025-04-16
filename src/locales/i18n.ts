import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 导入语言文件
import zhCN from "@/locales/zh-CN";
import enUS from "@/locales/en-US";

i18n.use(initReactI18next).init({
	resources: {
		"zh-CN": {
			translation: zhCN,
		},
		"en-US": {
			translation: enUS,
		},
	},
	lng: "zh-CN", // 默认语言
	fallbackLng: "zh-CN", // 回退语言
	interpolation: {
		escapeValue: false, // react已经转义了
	},
});

export default i18n;
