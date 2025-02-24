import { SizeType } from "@/components/Space/types";
import { PropsWithChildren } from "react";

export interface ConfigContextType {
	space?: SizeType | [SizeType, SizeType];
	locale?: "zh-CN" | "en-US";
}
export type propsType = PropsWithChildren<ConfigContextType>;
