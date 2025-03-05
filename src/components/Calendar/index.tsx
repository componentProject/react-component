import "./index.scss";
import dayjs from "dayjs"; // 日期处理库
import type { Dayjs } from "dayjs";
import MonthCalendar from "./components/MonthCalendar.tsx"; // 月份选择器组件
import Header from "./components/Header.tsx"; // 头部组件
import { useContext, useState } from "react"; // React hooks
import cs from "classnames"; //  utility for conditionally joining classNames together
import { useControllableValue } from "ahooks"; // ahooks 的 hook,用于处理受控和非受控组件

import type { propsType } from "./types"; // Calendar 组件的 props 类型
import { ConfigContext } from "../ConfigProvider"; // ConfigProvider 的 Context

/**
 * Calendar 组件
 * @param props Calendar 组件的 props
 */
function Calendar(props: propsType) {
	const {
		style, // Calendar 组件的样式
		className, // Calendar 组件的 className
		onChange, // 选择日期时的回调函数
	} = props; // 获取 props
	let { locale } = props; // 获取 locale
	const configProvider = useContext(ConfigContext); // 获取 ConfigProvider 的 Context
	locale = locale || configProvider?.locale || "zh-CN"; // 如果 locale 不存在,则使用 ConfigProvider 的 locale,否则使用 zh-CN

	/**
	 * 保存当前日期
	 * @param defaultValue 默认值,如果 props.value 不存在,则使用 defaultValue
	 */
	const [curValue, setCurValue] = useControllableValue<Dayjs>(props, {
		defaultValue: dayjs(), // 默认值为当前日期
	});

	/**
	 * 保存当前月份
	 */
	const [curMonth, setCurMonth] = useState<Dayjs>(curValue); // 保存当前月份

	/**
	 * 生成 className
	 */
	const classNames = cs("calendar", className); // 生成 className

	/**
	 * 选择日期时的回调函数
	 * @param date 选择的日期
	 */
	function selectHandler(date: Dayjs) {
		setCurValue(date); // 更新 curValue
		setCurMonth(date); // 更新 curMonth
		onChange?.(date); // 触发 onChange 回调函数
	}

	/**
	 * 上一个月份的回调函数
	 */
	function prevMonthHandler() {
		setCurMonth(curMonth.subtract(1, "month")); // 更新 curMonth
	}

	/**
	 * 下一个月份的回调函数
	 */
	function nextMonthHandler() {
		setCurMonth(curMonth.add(1, "month")); // 更新 curMonth
	}

	/**
	 * 今天的回调函数
	 */
	function todayHandler() {
		const date = dayjs(Date.now()); // 获取当前日期

		setCurValue(date); // 更新 curValue
		setCurMonth(date); // 更新 curMonth
		onChange?.(date); // 触发 onChange 回调函数
	}

	return (
		// 返回 Calendar 组件
		<div className={classNames} style={style}>
			<Header // 头部组件
				locale={locale}
				curMonth={curMonth}
				prevMonthHandler={prevMonthHandler}
				nextMonthHandler={nextMonthHandler}
				todayHandler={todayHandler}
			></Header>
			<MonthCalendar // 月份选择器组件
				{...props} // 传递 props
				locale={locale}
				value={curValue}
				curMonth={curMonth}
				selectHandler={selectHandler}
			/>
		</div>
	);
}

export default Calendar;
