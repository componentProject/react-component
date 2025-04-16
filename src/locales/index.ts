/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-11 14:37:11
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-16 18:30:33
 * @FilePath: \react-component\src\locales\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import i18n from "./i18n";
// 导出类型定义
export type { SupportedLocales, MessagesType, TranslationType } from "./types";

// 导出消息
export { default as messages } from "./messages";
export { default as enUS } from "./en-US";
export { default as zhCN } from "./zh-CN";

// 导出文件系统服务
export {
	getMessages,
	getLocaleMessages,
	getSupportedLocales,
	saveLocaleFile,
	saveMessagesFile,
	batchSaveFiles,
	clearCache,
} from "./fileSystem";
export default i18n;
