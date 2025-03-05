import type { PropsWithChildren } from "react";
import type { ReactNode } from "react";

/**
 * KeepAliveLayoutProps 接口定义
 *
 * @property {Array<string | RegExp>} keepPaths - 用于保持活跃状态的路径数组，可以是字符串或正则表达式
 * @property {Record<string, ReactNode>} [keepElements] - 可选属性，记录路径和对应的 React 节点
 * @property {(path: string) => void} [dropByPath] - 可选属性，函数，用于通过路径删除对应的元素
 */
export interface KeepAliveLayoutProps extends PropsWithChildren {
	keepPaths: Array<string | RegExp>;
	keepElements?: Record<string, ReactNode>;
	dropByPath?: (path: string) => void;
}
