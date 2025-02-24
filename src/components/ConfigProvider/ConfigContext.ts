import { createContext } from "react";
import { ConfigContextType } from "@/components/ConfigProvider/types";

export const ConfigContext = createContext<ConfigContextType>({});
