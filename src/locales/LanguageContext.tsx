import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

// 支持的语言映射
const COUNTRY_TO_LOCALE: Record<string, string> = {
	// 英语国家
	US: "en-US", // 美国
	GB: "en-US", // 英国
	AU: "en-US", // 澳大利亚
	CA: "en-US", // 加拿大

	// 中文区域
	CN: "zh-CN", // 中国大陆
	HK: "zh-CN", // 香港
	TW: "zh-CN", // 台湾
	SG: "zh-CN", // 新加坡
};

// 时区到语言的映射
const TIMEZONE_TO_LOCALE: Record<string, string> = {
	"Asia/Shanghai": "zh-CN",
	"Asia/Hong_Kong": "zh-CN",
	"Asia/Taipei": "zh-CN",
	"Asia/Singapore": "zh-CN",
	"America/New_York": "en-US",
	"America/Los_Angeles": "en-US",
	"Europe/London": "en-US",
	"Australia/Sydney": "en-US",
};

// 获取默认语言基于地理位置
const getLocaleFromGeoIP = async (): Promise<string | null> => {
	try {
		console.log("开始获取地理位置信息...");

		// 尝试使用多个免费 API，提高成功率
		// 尝试 ipinfo.io API (不需要 API key 的有限免费调用)
		try {
			console.log("尝试使用 ipinfo.io API...");
			const response = await fetch("https://ipinfo.io/json?token=ce3ed0d118a632", {
				headers: { Accept: "application/json" },
				// 添加较短的超时时间，防止过长等待
				signal: AbortSignal.timeout(5000), // 5秒超时
			});

			if (response.ok) {
				const data = await response.json();
				console.log("ipinfo.io API 返回数据:", data);

				if (data.country) {
					// 尝试通过国家代码获取语言
					const locale = await getLanguageFromCountryCode(data.country);
					if (locale) return locale;
				}
			} else {
				console.warn(`ipinfo.io API 响应错误: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			console.error("ipinfo.io API 调用失败:", error);
		}

		// 如果第一个 API 失败，尝试另一个免费 API
		try {
			console.log("尝试使用 ip-api.com API...");
			const response = await fetch("http://ip-api.com/json/", {
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(5000), // 5秒超时
			});

			if (response.ok) {
				const data = await response.json();
				console.log("ip-api.com API 返回数据:", data);

				if (data.countryCode) {
					// 尝试通过国家代码获取语言
					const locale = await getLanguageFromCountryCode(data.countryCode);
					if (locale) return locale;
				}
			} else {
				console.warn(`ip-api.com API 响应错误: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			console.error("ip-api.com API 调用失败:", error);
		}

		// 第三个备选 API
		try {
			console.log("尝试使用 ipapi.co API...");
			const response = await fetch("https://ipapi.co/json/", {
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(5000), // 5秒超时
			});

			if (response.ok) {
				const data = await response.json();
				console.log("ipapi.co API 返回数据:", data);

				if (data.country_code) {
					// 尝试通过国家代码获取语言
					const locale = await getLanguageFromCountryCode(data.country_code);
					if (locale) return locale;
				}
			} else {
				console.warn(`ipapi.co API 响应错误: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			console.error("ipapi.co API 调用失败:", error);
		}

		console.warn("所有 IP 地理位置 API 都调用失败");

		// 如果所有API调用都失败，使用本地规则
		console.log("尝试使用本地规则判断...");

		// 使用浏览器语言作为最后的回退方案
		return getBrowserLanguage();
	} catch (error) {
		console.error("获取地理位置失败 (最外层错误处理):", error);
		return null;
	}
};

// 辅助函数：从国家代码获取语言
const getLanguageFromCountryCode = async (countryCode: string): Promise<string | null> => {
	console.log(`获取国家 ${countryCode} 的语言信息...`);

	// 尝试使用 RestCountries API 获取更精确的语言信息
	try {
		console.log("尝试通过 RestCountries API 获取语言信息...");
		const languageResponse = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(5000), // 5秒超时
		});

		if (languageResponse.ok) {
			const countryData = await languageResponse.json();
			console.log("RestCountries API 返回数据:", countryData);

			if (countryData && countryData.length > 0) {
				// 获取该国家的官方语言列表
				const languages = countryData[0].languages;
				console.log("国家语言信息:", languages);

				// 根据国家语言确定应用语言
				if (languages) {
					// 优先检查是否有中文
					if (languages.zho || languages.zh || languages.chi) {
						console.log("检测到中文语言，返回 zh-CN");
						return "zh-CN";
					}
					// 检查是否有英语
					if (languages.eng || languages.en) {
						console.log("检测到英文语言，返回 en-US");
						return "en-US";
					}
				}
			}
		} else {
			console.warn(`RestCountries API 响应错误: ${languageResponse.status} ${languageResponse.statusText}`);
		}
	} catch (error) {
		console.error("RestCountries API 调用失败:", error);
	}

	// 使用本地映射作为备选方案
	if (COUNTRY_TO_LOCALE[countryCode]) {
		console.log(`通过本地映射确定语言: ${COUNTRY_TO_LOCALE[countryCode]}`);
		return COUNTRY_TO_LOCALE[countryCode];
	}

	// 如果以上都失败，尝试基于国家代码的简单规则
	console.log("使用简单规则判断语言...");
	if (countryCode === "CN" || countryCode === "HK" || countryCode === "TW" || countryCode === "SG") {
		return "zh-CN";
	}
	return "en-US"; // 默认返回英文
};

// 基于时区获取语言
const getLocaleFromTimezone = async (): Promise<string | null> => {
	try {
		console.log("开始基于时区获取语言信息...");

		// 获取当前时区
		let timezone: string | undefined;

		try {
			timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			console.log("获取到的时区:", timezone);
		} catch (tzError) {
			console.error("获取时区失败:", tzError);
			// 无法获取时区信息时，尝试使用浏览器语言
			return getBrowserLanguage();
		}

		if (!timezone) {
			console.warn("无法获取时区信息");
			// 回退到浏览器语言
			return getBrowserLanguage();
		}

		// 方法1: 使用无需API Key的公共时区服务
		try {
			console.log("尝试使用 WorldTimeAPI 获取时区信息...");
			const response = await fetch(`https://worldtimeapi.org/api/timezone/${encodeURIComponent(timezone)}`, {
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(5000), // 5秒超时
			});

			if (response.ok) {
				const data = await response.json();
				console.log("WorldTimeAPI 返回数据:", data);

				// 从 WorldTimeAPI 数据中提取有用信息
				if (data && data.timezone) {
					// 有些 API 返回国家代码或地区代码
					const regionParts = data.timezone.split("/");
					if (regionParts.length > 1) {
						const region = regionParts[0]; // 'Asia', 'Europe', 'America' 等

						if (region === "Asia") {
							console.log("检测到亚洲时区，返回中文");
							return "zh-CN";
						}

						if (["America", "Europe", "Australia", "Pacific"].includes(region)) {
							console.log(`检测到${region}时区，返回英文`);
							return "en-US";
						}
					}
				}
			} else {
				console.warn(`WorldTimeAPI 响应错误: ${response.status} ${response.statusText}`);
			}
		} catch (apiError) {
			console.error("WorldTimeAPI 调用失败:", apiError);
		}

		// 方法2: 备用 IP 地理位置服务
		try {
			console.log("尝试使用 ipapi.co 获取位置信息...");
			const response = await fetch("https://ipapi.co/json/", {
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(5000), // 5秒超时
			});

			if (response.ok) {
				const data = await response.json();
				console.log("ipapi.co API 返回数据:", data);

				// 如果返回了时区信息
				if (data.timezone) {
					console.log(`通过 ipapi.co 获取到时区: ${data.timezone}`);
					if (TIMEZONE_TO_LOCALE[data.timezone]) {
						return TIMEZONE_TO_LOCALE[data.timezone];
					}
				}

				// 如果返回了国家代码，尝试基于国家获取语言
				if (data.country_code) {
					console.log(`通过 ipapi.co 获取到国家代码: ${data.country_code}`);
					const countryLocale = await getLanguageFromCountryCode(data.country_code);
					if (countryLocale) {
						return countryLocale;
					}
				}

				// 如果返回了语言代码，直接使用
				if (data.languages) {
					console.log(`通过 ipapi.co 获取到语言: ${data.languages}`);
					const languages = data.languages.split(",");
					if (languages.length > 0) {
						const primaryLang = languages[0].split("-")[0].toLowerCase();
						if (primaryLang === "zh") {
							return "zh-CN";
						} else if (primaryLang === "en") {
							return "en-US";
						}
					}
				}
			}
		} catch (apiError) {
			console.error("ipapi.co API 调用失败:", apiError);
		}

		// 方法3: 直接使用本地映射
		if (TIMEZONE_TO_LOCALE[timezone]) {
			console.log(`通过本地时区映射确定语言: ${TIMEZONE_TO_LOCALE[timezone]}`);
			return TIMEZONE_TO_LOCALE[timezone];
		}

		// 方法4: 基于时区的启发式规则
		console.log("使用时区前缀启发式规则...");

		// 基于通用时区前缀判断
		if (timezone.startsWith("Asia/")) {
			console.log("基于前缀判断为亚洲时区，返回中文");
			return "zh-CN";
		}

		if (
			timezone.startsWith("America/") ||
			timezone.startsWith("US/") ||
			timezone.startsWith("Europe/") ||
			timezone.startsWith("Australia/") ||
			timezone.startsWith("Pacific/")
		) {
			console.log(`基于前缀判断为 ${timezone.split("/")[0]} 时区，返回英文`);
			return "en-US";
		}

		// 方法5: 浏览器语言
		return getBrowserLanguage();
	} catch (error) {
		console.error("获取时区语言失败 (最外层错误处理):", error);
		// 尝试浏览器语言作为最后的回退
		return getBrowserLanguage();
	}
};

// 从浏览器语言设置获取语言
const getBrowserLanguage = (): string | null => {
	try {
		console.log("尝试获取浏览器语言设置...");

		// 获取浏览器语言
		const browserLanguage = navigator.language || (navigator as any).userLanguage || (navigator as any).browserLanguage;

		console.log("浏览器语言:", browserLanguage);

		if (browserLanguage) {
			const langCode = browserLanguage.toLowerCase().split("-")[0];

			if (langCode === "zh") {
				console.log("检测到浏览器中文语言，返回 zh-CN");
				return "zh-CN";
			}

			if (langCode === "en") {
				console.log("检测到浏览器英文语言，返回 en-US");
				return "en-US";
			}
		}

		console.log("无法从浏览器语言确定应用语言，默认返回 null");
		return null;
	} catch (error) {
		console.error("获取浏览器语言失败:", error);
		return null;
	}
};

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
	// 默认使用 localStorage 中保存的语言或中文
	const [locale, setLocale] = useState<string>(() => {
		return localStorage.getItem("app-locale") || "zh-CN";
	});

	// 更新语言的函数
	const changeLocale = (newLocale: string) => {
		setLocale(newLocale);
		localStorage.setItem("app-locale", newLocale);
		// 设置 document 的语言属性
		document.documentElement.lang = newLocale;
	};

	// 首次挂载时执行自动检测语言
	useEffect(() => {
		const autoDetectLocale = async () => {
			// 如果已经有本地存储的语言设置，优先使用它
			const savedLocale = localStorage.getItem("app-locale");
			if (savedLocale) {
				console.log("使用本地缓存的语言设置:", savedLocale);
				changeLocale(savedLocale);
				return;
			}

			// 尝试基于 IP 地理位置获取语言
			const geoLocale = await getLocaleFromGeoIP();
			if (geoLocale) {
				console.log("基于地理位置设置语言:", geoLocale);
				changeLocale(geoLocale);
				return;
			}

			// 如果地理位置 API 失败，尝试基于时区获取语言
			const timezoneLocale = await getLocaleFromTimezone();
			if (timezoneLocale) {
				console.log("基于时区设置语言:", timezoneLocale);
				changeLocale(timezoneLocale);
				return;
			}

			// 如果都失败了，使用默认的中文
			console.log("使用默认语言: zh-CN");
			changeLocale("zh-CN");
		};

		autoDetectLocale();
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
