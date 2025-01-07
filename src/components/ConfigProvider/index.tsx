import React, { PropsWithChildren } from "react";
import { SizeType } from "../Space/types";

export interface ConfigContextType {
	space?: SizeType | [SizeType, SizeType];
	locale?: "zh-CN" | "en-US";
}

export const ConfigContext = React.createContext<ConfigContextType>({});

type ConfigProviderProps = PropsWithChildren<ConfigContextType>;

export default function ConfigProvider(props: ConfigProviderProps) {
	const { space, locale = "zh-CN", children } = props;

	return <ConfigContext.Provider value={{ space, locale }}>{children}</ConfigContext.Provider>;
}
