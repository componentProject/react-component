import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface LanguageContextType {
	locale: string;
	setLocale: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
	locale: "zh-CN",
	setLocale: () => {},
});

interface LanguageProviderProps {
	children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
	// 从 localStorage 读取初始语言，如果没有则使用默认值
	const [locale, setLocale] = useState<string>(() => {
		return localStorage.getItem("app-locale") || "zh-CN";
	});

	const changeLocale = (newLocale: string) => {
		setLocale(newLocale);
		localStorage.setItem("app-locale", newLocale);
		// 可选：设置 document 的语言属性
		document.documentElement.lang = newLocale;
	};

	// 首次挂载时设置 document 语言
	useEffect(() => {
		document.documentElement.lang = locale;
	}, []);

	return <LanguageContext.Provider value={{ locale, setLocale: changeLocale }}>{children}</LanguageContext.Provider>;
};

// 自定义 hook 方便在组件中使用
export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}

export default LanguageContext;
