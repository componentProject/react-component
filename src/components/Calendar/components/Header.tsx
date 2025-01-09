import { Dayjs } from "dayjs";
import allLocales from "../locale";

interface HeaderProps {
	locale: "zh-CN" | "en-US";
	curMonth: Dayjs;
	prevMonthHandler: () => void;
	nextMonthHandler: () => void;
	todayHandler: () => void;
}

function Header(props: HeaderProps) {
	const { curMonth, prevMonthHandler, nextMonthHandler, todayHandler, locale } = props;
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
