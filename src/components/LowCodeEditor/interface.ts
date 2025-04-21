/**
 * 导入React类型定义
 */
import { CSSProperties, PropsWithChildren } from "react";

/**
 * 通用组件属性接口
 * 定义组件的基本属性，如ID、名称、样式等
 * @interface CommonComponentProps
 * @extends {PropsWithChildren}
 */
export interface CommonComponentProps extends PropsWithChildren {
	/** 组件唯一标识ID */
	id: number;
	/** 组件名称 */
	name: string;
	/** 组件CSS样式 */
	styles?: CSSProperties;
	/** 其他任意属性 */
	[key: string]: any;
}
