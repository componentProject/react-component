import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import zh from "./lang/zh";
import en from "./lang/en";

const resources = Object.entries({ zh, en }).reduce((p, [key, value]) => {
	p[key] = {
		translation: value,
	};
	return p;
}, {});
i18n
	// 检测用户当前使用的语言
	.use(LanguageDetector)
	// 注入 react-i18next 实例
	.use(initReactI18next)
	.init({
		lng: "en",
		fallbackLng: "en", // 默认语言
		debug: true, // 开发模式下启用调试
		interpolation: {
			escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
		},
		resources,
	});

export default i18n;
