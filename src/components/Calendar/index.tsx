import './index.scss';
import dayjs, {Dayjs} from 'dayjs';
import MonthCalendar from './components/MonthCalendar.tsx';
import Header from './components/Header.tsx';
import {useContext, useState} from 'react';
import cs from 'classnames';
import {useControllableValue} from 'ahooks';

import type {CalendarProps} from './types'
import {ConfigContext} from "../ConfigProvider";

function Calendar(props: CalendarProps) {

	const {
		style,
		className,
		onChange
	} = props;
	let {locale} = props;
	const configProvider = useContext(ConfigContext);
	console.log('configProvider', configProvider)
	locale = locale || configProvider?.locale;

	const [curValue, setCurValue] = useControllableValue<Dayjs>(props, {
		defaultValue: dayjs()
	});

	const [curMonth, setCurMonth] = useState<Dayjs>(curValue);

	const classNames = cs("calendar", className);

	function selectHandler(date: Dayjs) {
		setCurValue(date);
		setCurMonth(date);
		onChange?.(date);
	}

	function prevMonthHandler() {
		setCurMonth(curMonth.subtract(1, 'month'));
	}

	function nextMonthHandler() {
		setCurMonth(curMonth.add(1, 'month'));
	}

	function todayHandler() {
		const date = dayjs(Date.now());

		setCurValue(date);
		setCurMonth(date);
		onChange?.(date);
	}

	return <div className={classNames} style={style}>
		<Header
			locale={locale}
			curMonth={curMonth}
			prevMonthHandler={prevMonthHandler}
			nextMonthHandler={nextMonthHandler}
			todayHandler={todayHandler}
		></Header>
		<MonthCalendar  {...props} locale={locale} value={curValue} curMonth={curMonth} selectHandler={selectHandler}/>
	</div>
}

export default Calendar;
