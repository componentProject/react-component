import { createContext } from "react";
import type { KeepAliveLayoutProps } from "./types";

/**
 * KeepAliveContextType 类型定义
 * 从 KeepAliveLayoutProps 中移除 "children" 属性后得到的类型
 */
type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, "children">;

/**
 * 用于存储需要保持活跃的元素
 * 类型为 KeepAliveContextType 中的 keepElements 属性类型
 */
const keepElements: KeepAliveContextType["keepElements"] = {};

/**
 * 创建 KeepAliveContext
 * 默认值中包含 keepPaths、keepElements 和 dropByPath 方法
 */
export const KeepAliveContext = createContext<KeepAliveContextType>({
	/**
	 * 需要保持活跃的路径数组
	 * 初始化为空数组
	 */
	keepPaths: [],
	/**
	 * 需要保持活跃的元素
	 * 初始化为上面定义的 keepElements
	 */
	keepElements,
	/**
	 * 根据路径移除对应的元素
	 * 将指定路径的元素设置为 null
	 */
	dropByPath(path: string) {
		keepElements[path] = null;
	},
});
