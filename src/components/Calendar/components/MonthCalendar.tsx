/**
 * @file MonthCalendar.tsx
 * @description 月历组件，用于显示和选择日期
 */

/** 导入日期类型 */
import type { Dayjs } from "dayjs";
/** 导入React元素类型 */
import type { ReactElement } from "react";
/** 导入属性类型 */
import type { propsType } from "../types";
/** 导入本地化配置 */
import allLocales from "../locale";
/** 导入类名工具 */
import cs from "classnames";

/**
 * 定义月历组件的props接口，继承自基础的propsType
 */
interface MonthCalendarProps extends propsType {
	/**
	 * 选择日期的回调函数
	 */
	selectHandler?: (date: Dayjs) => void;
	/**
	 * 当前显示的月份
	 */
	curMonth: Dayjs;
}

/**
 * 获取当前月份及其前后补全的所有日期
 * @param date - 当前日期
 * @returns 返回一个包含日期信息的数组
 */
function getAllDays(date: Dayjs) {
	const startDate = date.startOf("month");
	/** 获取当前月份的第一天 */
	const day = startDate.day(); /** 获取第一天是星期几 */

	/** 创建一个长度为42的数组来存储日期信息 */
	const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(6 * 7);

	/** 填充当前月份第一天之前的日期 */
	for (let i = 0; i < day; i++) {
		daysInfo[i] = {
			date: startDate.subtract(day - i, "day") /** 通过减去天数获取上月的几天 */,
			currentMonth: false /** 标记为非当前月 */,
		};
	}

	/** 填充当前月份的所有日期及其后的日期 */
	for (let i = day; i < daysInfo.length; i++) {
		const calcDate = startDate.add(i - day, "day"); /** 通过增加天数计算日期 */

		daysInfo[i] = {
			date: calcDate,
			currentMonth: calcDate.month() === date.month() /** 判断是否为当前月 */,
		};
	}

	return daysInfo;
}

/**
 * 月历组件，渲染当前月份的日期
 * @param props - 组件的props
 * @returns 返回月份日历的渲染结果
 */
function MonthCalendar(props: MonthCalendarProps) {
	/** 解构props */
	const { value, curMonth, dateRender, dateInnerContent, selectHandler, locale = "zh-CN" } = props;

	/** 获取本地化的日历语言文件 */
	const CalendarLocale = allLocales[locale];

	/** 定义周列表，从周日到周六 */
	const weekList = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

	/** 获取当前要显示的所有日期 */
	const allDays = getAllDays(curMonth);

	/**
	 * 渲染日期的方法
	 * @param days - 日期信息数组
	 * @returns 返回渲染结果
	 */
	function renderDays(days: Array<{ date: Dayjs; currentMonth: boolean }>) {
		const rows: Array<ReactElement[]> = []; /** 存储每一行的日期元素 */
		for (let i = 0; i < 6; i++) {
			/** 每个月最多显示6行 */
			const row: ReactElement[] = [];
			for (let j = 0; j < 7; j++) {
				/** 每行7天 */
				const item = days[i * 7 + j]; /** 获取当前日期信息 */
				row[j] = (
					<div
						className={"calendar-month-body-cell " + (item.currentMonth ? "calendar-month-body-cell-current" : "")}
						onClick={() => selectHandler?.(item.date)} /** 点击日期触发选择回调 */
						key={`${i}-${j}`} /** 设置唯一的key */
					>
						{dateRender ? (
							dateRender(item.date) /** 如果有自定义渲染函数则使用它 */
						) : (
							<div className="calendar-month-body-cell-date">
								<div
									className={cs(
										"calendar-month-body-cell-date-value",
										value?.format("YYYY-MM-DD") === item.date.format("YYYY-MM-DD")
											? "calendar-month-body-cell-date-selected"
											: "",
									)}
								>
									{/* 显示日期中的天 */}
									{item.date.date()}
								</div>
								<div className="calendar-month-cell-body-date-content">{dateInnerContent?.(item.date)}</div>
							</div>
						)}
					</div>
				);
			}
			rows.push(row); /** 将每一行加入到rows中 */
		}
		/** 返回所有行的渲染结果 */
		return rows.map((row) => <div className="calendar-month-body-row">{row}</div>);
	}

	/** 返回整个组件的渲染结果 */
	return (
		<div className="calendar-month">
			<div className="calendar-month-week-list">
				{weekList.map((week) => (
					<div className="calendar-month-week-list-item" key={week}>
						{/* 显示本地化的周名称 */}
						{CalendarLocale.week[week]}
					</div>
				))}
			</div>
			{/* 渲染日期 */}
			<div className="calendar-month-body">{renderDays(allDays)}</div>
		</div>
	);
}

export default MonthCalendar;
