import { matchPath, useLocation, useOutlet } from "react-router-dom";
import { useContext } from "react";
import { KeepAliveContext } from "./KeepAliveContext.tsx";

/**
 * 判断给定路径是否在需要保持活动的路径列表中
 * @param keepPaths 包含需要保持活动的路径的数组，可以是字符串或正则表达式
 * @param path 当前路径
 * @returns 如果路径在列表中返回true，否则返回false
 */
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

/**
 * 自定义hook，用于保持React组件的元素在其路径匹配时保持活动
 * @returns 返回包含保持活动的元素和当前渲染元素的React片段
 */
export function useKeepOutLet() {
	/** 获取当前路径信息 */
	const location = useLocation();
	/** 获取当前路径对应的React元素 */
	const element = useOutlet();

	/** 从上下文中获取保持活动的元素和路径信息 */
	const { keepElements, keepPaths } = useContext(KeepAliveContext);
	/** 判断当前路径是否需要保持活动 */
	const isKeep = isKeepPath(keepPaths, location.pathname);

	/** 如果需要保持活动，将当前元素存入keepElements */
	if (isKeep) {
		keepElements![location.pathname] = element;
	}

	return (
		<>
			{
				/** 遍历所有保持活动的元素，并根据路径匹配显示对应的元素 */
				Object.entries(keepElements).map(([pathname, element]) => (
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
				))
			}
			{
				/** 如果当前路径不需要保持活动，则渲染当前元素 */
				!isKeep && element
			}
		</>
	);
}
