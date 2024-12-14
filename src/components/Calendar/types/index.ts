import {Dayjs} from "dayjs";
import {CSSProperties, ReactNode} from "react";

export interface CalendarProps {
	value?: Dayjs;
	defaultValue?: Dayjs;
	style?: CSSProperties;
	className?: string | string[];
	/**
	 * 定制日期显示，会完全覆盖日期单元格
	 * @param currentDate 当前的Dayjs对象
	 */
	dateRender?: (currentDate: Dayjs) => ReactNode;
	/**
	 * 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
	 * @param currentDate
	 */
	dateInnerContent?: (currentDate: Dayjs) => ReactNode;
	/**
	 * 国际化相关
	 */
	locale?: 'zh-CN' | 'en-US';
	onChange?: (date: Dayjs) => void;
}
