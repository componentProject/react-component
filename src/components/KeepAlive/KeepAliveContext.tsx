import { createContext } from "react";
import type { KeepAliveLayoutProps } from "./types";

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, "children">;

const keepElements: KeepAliveContextType["keepElements"] = {};

export const KeepAliveContext = createContext<KeepAliveContextType>({
	keepPaths: [],
	keepElements,
	dropByPath(path: string) {
		keepElements[path] = null;
	},
});
