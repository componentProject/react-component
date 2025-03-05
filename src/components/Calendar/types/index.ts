import type { Dayjs } from "dayjs";
import type { CSSProperties, ReactNode } from "react";

export interface propsType {
	/**
	 * 选择的日期
	 */
	value?: Dayjs;
	/**
	 * 默认的日期
	 */
	defaultValue?: Dayjs;
	/**
	 * 日历的样式
	 */
	style?: CSSProperties;
	/**
	 * 日历的类名
	 */
	className?: string | string[];
	/**
	 * 定制日期显示
	 * 该函数会完全覆盖日期单元格
	 * @param currentDate 当前的Dayjs对象
	 */
	dateRender?: (currentDate: Dayjs) => ReactNode;
	/**
	 * 定制日期单元格
	 * 该函数的返回值会被添加到单元格内
	 * 只在全屏日历模式下生效
	 * @param currentDate
	 */
	dateInnerContent?: (currentDate: Dayjs) => ReactNode;
	/**
	 * 语言
	 * zh-CN | en-US
	 */
	locale?: "zh-CN" | "en-US";
	/**
	 * 选择日期时的回调函数
	 * @param date 选择的日期
	 */
	onChange?: (date: Dayjs) => void;
}
