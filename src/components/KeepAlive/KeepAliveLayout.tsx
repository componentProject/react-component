import { useContext } from "react";
import type { FC } from "react";
import type { KeepAliveLayoutProps } from "./types";
import { KeepAliveContext } from "./KeepAliveContext.tsx";
export const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
	const { keepPaths, ...other } = props;

	const { keepElements, dropByPath } = useContext(KeepAliveContext);

	return <KeepAliveContext.Provider value={{ keepPaths, keepElements, dropByPath }} {...other} />;
};
