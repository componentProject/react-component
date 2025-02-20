import {
	useMountedState,
	useLifecycles,
	useCookie,
	useHover,
	useScrolling,
	useTimeout,
	useCountDown,
	useSize,
	useWhyDidYouUpdate,
} from "@/hooks";
import { useState, useEffect, useRef } from "react";
import type { FC } from "react";

export default {
	title: "hook",
	component: null,
	args: {},
	argTypes: {},
};
/**
 * 获取组件是否 mount 到 dom
 * @constructor
 */
export const MountedState = () => {
	const isMounted = useMountedState();
	const [, setNum] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setNum(1);
		}, 1000);
	}, []);

	return <div>{isMounted() ? "mounted" : "pending"}</div>;
};
/**
 * 监听元素的挂载和卸载
 * 接收两个参数,分别为 挂载callback,卸载callback
 */
export const Lifecycles = () => {
	const [mountStatus, setMountStatus] = useState("初始化");
	useLifecycles(
		() => setMountStatus("MOUNTED"),
		() => setMountStatus("UNMOUNTED"),
	);

	return <div>{mountStatus}</div>;
};
/**
 * 获取指定名称的cookie,返回[指定cookie的值,更新指定cookie的函数,删除指定cookie的函数]
 */
export const Cookie = () => {
	const [value, updateCookie, deleteCookie] = useCookie("guang");

	useEffect(() => {
		deleteCookie();
	}, []);

	const updateCookieHandler = () => {
		updateCookie("666");
	};

	return (
		<div>
			<p>cookie 值: {value}</p>
			<button onClick={updateCookieHandler}>更新 Cookie</button>
			<br />
			<button onClick={deleteCookie}>删除 Cookie</button>
		</div>
	);
};

/**
 * 监听ref是否处于鼠标悬浮状态
 */
export const Hover = () => {
	const element = (hovered: boolean) => <div>Hover me! {hovered && "Thanks"}</div>;

	const [hoverable, hovered] = useHover(element);

	return (
		<div>
			{hoverable}
			<div>{hovered ? "HOVERED" : ""}</div>
		</div>
	);
};
/**
 * 监听ref是否在滚动
 */
export const Scrolling = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const scrolling = useScrolling(scrollRef);

	return (
		<>
			{<div>{scrolling ? "滚动中.." : "没有滚动"}</div>}

			<div ref={scrollRef} style={{ height: "200px", overflow: "auto" }}>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
				<div>guang</div>
			</div>
		</>
	);
};
/**
 * 获取元素的大小,并在size改变后重新计算
 */
export const Size = () => {
	const ref = useRef<HTMLDivElement>(null);
	const size = useSize(ref);
	return (
		<div ref={ref}>
			<p>改变窗口大小试试</p>
			<p>
				width: {size?.width}px, height: {size?.height}px
			</p>
		</div>
	);
};
/**
 * 保障定时器只执行一次
 */
export const Timeout = () => {
	const [state, setState] = useState(1);
	useTimeout(() => {
		setState(state + 1);
	}, 3000);

	return <div>{state}</div>;
};
/**
 * 获取到指定时间的倒计时倒计时
 */
export const Countdown = () => {
	const [countdown, formattedRes] = useCountDown({
		targetDate: `${new Date().getFullYear()}-12-31 23:59:59`,
	});

	console.log("countdown", countdown);
	const { days, hours, minutes, seconds, milliseconds } = formattedRes;

	return (
		<p>
			距离今年年底还剩 {days} 天 {hours} 小时 {minutes} 分钟 {seconds} 秒 {milliseconds} 毫秒
		</p>
	);
};

const Demo: FC<{ count: number }> = (props) => {
	const [randomNum, setRandomNum] = useState(Math.random());

	useWhyDidYouUpdate("Demo", { ...props, randomNum });

	return (
		<div>
			<div>
				<span>number: {props.count}</span>
			</div>
			<div>
				randomNum: {randomNum}
				<button onClick={() => setRandomNum(Math.random)}>设置随机 state</button>
			</div>
		</div>
	);
};
/**
 * 获取哪些 props 改变导致的重新渲染
 */
export const WhyDidYouUpdate = () => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<Demo count={count} />
			<div>
				<button onClick={() => setCount((prevCount) => prevCount - 1)}>减一</button>
				<button onClick={() => setCount((prevCount) => prevCount + 1)}>加一</button>
			</div>
		</div>
	);
};
