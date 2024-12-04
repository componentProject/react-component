import React, { PropsWithChildren } from "react";
import { SizeType } from "../Space.ts";

export interface ConfigContextType {
  space?: SizeType| [SizeType, SizeType]
}
export const ConfigContext = React.createContext<ConfigContextType>({});

type ConfigProviderProps = PropsWithChildren<ConfigContextType>

export function ConfigProvider(props: ConfigProviderProps) {
  const {
    space,
    children
  } = props;

  return <ConfigContext.Provider value={{ space }}>{children}</ConfigContext.Provider>
}

