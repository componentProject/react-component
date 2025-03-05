import type { SizeType } from "@/components/Space/types";
import type { PropsWithChildren } from "react";

/**
 * ConfigProvider 的 context
 *
 * @property {SizeType | [SizeType, SizeType]} space - 间距
 * @property {string} locale - 语言
 */
export interface ConfigContextType {
	space?: SizeType | [SizeType, SizeType];
	locale?: "zh-CN" | "en-US";
}

/**
 * ConfigProvider 的 props
 */
export type propsType = PropsWithChildren<ConfigContextType>;
