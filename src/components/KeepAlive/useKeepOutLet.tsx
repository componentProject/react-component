import { matchPath, useLocation, useOutlet } from "react-router-dom";
import { useContext } from "react";
import { KeepAliveContext } from "./KeepAliveContext.tsx";

const isKeepPath = (keepPaths: Array<string | RegExp>, path: string) => {
	let isKeep = false;
	for (let i = 0; i < keepPaths.length; i++) {
		const item = keepPaths[i];
		if (item === path) {
			isKeep = true;
		}
		if (item instanceof RegExp && item.test(path)) {
			isKeep = true;
		}
		if (typeof item === "string" && item.toLowerCase() === path) {
			isKeep = true;
		}
	}
	return isKeep;
};

export function useKeepOutLet() {
	const location = useLocation();
	const element = useOutlet();

	const { keepElements, keepPaths } = useContext(KeepAliveContext);
	const isKeep = isKeepPath(keepPaths, location.pathname);

	if (isKeep) {
		keepElements![location.pathname] = element;
	}

	return (
		<>
			{Object.entries(keepElements).map(([pathname, element]) => (
				<div
					key={pathname}
					style={{
						height: "100%",
						width: "100%",
						position: "relative",
						overflow: "hidden auto",
					}}
					className="keep-alive-page"
					hidden={!matchPath(location.pathname, pathname)}
				>
					{element}
				</div>
			))}
			{!isKeep && element}
		</>
	);
}
