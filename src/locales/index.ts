// 导出类型定义
export type { SupportedLocales, MessagesType, TranslationType } from "./types";

// 导出消息
export { default as messages } from "./messages";
export { default as enUS } from "./en-US";
export { default as zhCN } from "./zh-CN";

// 导出文件系统服务
export { getMessages, getLocaleMessages, getSupportedLocales, saveLocaleFile, saveMessagesFile, batchSaveFiles, clearCache } from "./fileSystem";
