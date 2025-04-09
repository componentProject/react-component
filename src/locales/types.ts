/**
 * 国际化消息定义类型
 */
export interface MessageDescriptor {
	/** 默认消息文本 */
	defaultMessage: string;
	/** 消息描述 */
	description: string;
}

/**
 * 消息定义列表类型
 */
export interface MessagesType {
	[key: string]: MessageDescriptor;
}

/**
 * 翻译文件类型
 */
export interface TranslationType {
	[key: string]: string;
}

/**
 * 支持的语言类型
 */
export type SupportedLocales = "zh-CN" | "en-US";
