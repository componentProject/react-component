import type { Dayjs } from "dayjs";
import allLocales from "../locale";

/**
 * Header组件的props
 *
 * Header组件需要的props，包括语言、当前月份、上一个月份的回调函数、下一个月份的回调函数、今天的回调函数
 */
interface HeaderProps {
	/**
	 * 语言
	 *
	 * 语言可以是zh-CN或en-US
	 */
	locale: "zh-CN" | "en-US";

	/**
	 * 当前月份
	 *
	 * 当前月份的Dayjs对象
	 */
	curMonth: Dayjs;

	/**
	 * 上一个月份的回调函数
	 *
	 * 点击上一个月份按钮时的回调函数
	 */
	prevMonthHandler: () => void;

	/**
	 * 下一个月份的回调函数
	 *
	 * 点击下一个月份按钮时的回调函数
	 */
	nextMonthHandler: () => void;

	/**
	 * 今天的回调函数
	 *
	 * 点击今天按钮时的回调函数
	 */
	todayHandler: () => void;
}

/**
 * Header组件
 *
 * Header组件，用于显示当前月份、上一个月份、下一个月份、今天按钮
 * @param props Header组件的props
 */
function Header(props: HeaderProps) {
	const { curMonth, prevMonthHandler, nextMonthHandler, todayHandler, locale } = props;

	/**
	 * 语言Context
	 *
	 * 语言Context对象，用于获取当前语言的翻译
	 */
	const CalendarContext = allLocales[locale];

	return (
		<div className="calendar-header">
			<div className="calendar-header-left">
				<div className="calendar-header-icon" onClick={prevMonthHandler}>
					&lt;
				</div>
				<div className="calendar-header-value">{curMonth.format(CalendarContext.formatMonth)}</div>
				<div className="calendar-header-icon" onClick={nextMonthHandler}>
					&gt;
				</div>
				<button className="calendar-header-btn" onClick={todayHandler}>
					{CalendarContext.today}
				</button>
			</div>
		</div>
	);
}

export default Header;
