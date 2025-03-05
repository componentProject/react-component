import { useContext } from "react";
import type { FC } from "react";
import type { KeepAliveLayoutProps } from "./types";
import { KeepAliveContext } from "./KeepAliveContext.tsx";

/**
 * KeepAliveLayout组件
 *
 * @param props 组件接收的属性
 * @param props.keepPaths 要保持活跃状态的路径数组
 * @param props.other 其他属性
 *
 * @returns React元素
 */
export const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
	const { keepPaths, ...other } = props;

	/**
	 * 从KeepAliveContext获取上下文信息
	 *
	 * @param keepElements 缓存的页面元素
	 * @param dropByPath 用于移除指定路径的元素
	 */
	const { keepElements, dropByPath } = useContext(KeepAliveContext);

	/**
	 * 返回KeepAliveContext的Provider组件
	 *
	 * @param value 提供给Provider的上下文值
	 * @param other 其他传递给Provider的属性
	 *
	 * @returns KeepAliveContext.Provider
	 */
	return <KeepAliveContext.Provider value={{ keepPaths, keepElements, dropByPath }} {...other} />;
};
