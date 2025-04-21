/**
 * 导入React类型定义
 */
import { CSSProperties, PropsWithChildren } from "react";

/**
 * 通用组件属性接口
 *
 * 定义了低代码平台中所有组件共有的基础属性
 * @interface CommonComponentProps
 * @extends {PropsWithChildren}
 */
export interface CommonComponentProps extends PropsWithChildren {
	/**
	 * 组件唯一标识ID
	 */
	id: number;
	/**
	 * 组件名称
	 */
	name: string;
	/**
	 * 组件样式属性，可选
	 */
	styles?: CSSProperties;
	/**
	 * 任意其他属性，用于扩展
	 */
	[key: string]: any;
}
