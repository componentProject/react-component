import { useEffect, useRef } from "react";

/**
 * useTimer 的 props
 *
 * @property {number} id -  MessageProvider 传入的唯一标识符
 * @property {number} [duration=2000] -  MessageProvider 传入的延迟时间
 * @property {(id: number) => void} remove -  MessageProvider 传入的移除函数
 */
export interface UseTimerProps {
	id: number;
	duration?: number;
	remove: (id: number) => void;
}

/**
 * useTimer Hooks
 *
 * @param props -  useTimer  props
 * @returns -  MessageProvider 传入的延迟时间
 */
export function useTimer(props: UseTimerProps) {
	const { remove, id, duration = 2000 } = props;

	/**
	 * timerRef
	 *
	 *  Timer  的引用
	 */
	const timer = useRef<number | null>(null);

	/**
	 * startTimer
	 *
	 *  Timer  的启动函数
	 */
	const startTimer = () => {
		/**
		 *  Timer  的启动
		 */
		timer.current = window.setTimeout(() => {
			/**
			 *  MessageProvider  传入的移除函数
			 */
			remove(id);
			/**
			 *  Timer  的清除
			 */
			removeTimer();
		}, duration);
	};

	/**
	 * removeTimer
	 *
	 *  Timer  的清除函数
	 */
	const removeTimer = () => {
		if (timer.current) {
			/**
			 *  Timer  的清除
			 */
			clearTimeout(timer.current);
			timer.current = null;
		}
	};

	/**
	 *  useTimer  Hooks 的副作用
	 *
	 *  startTimer  的调用
	 *  removeTimer  的调用
	 */
	useEffect(() => {
		startTimer();
		return () => removeTimer();
	}, []);

	/**
	 * onMouseEnter
	 *
	 *  MessageProvider  传入的移除函数
	 */
	const onMouseEnter = () => {
		removeTimer();
	};

	/**
	 * onMouseLeave
	 *
	 *  startTimer  的调用
	 */
	const onMouseLeave = () => {
		startTimer();
	};

	return {
		onMouseEnter,
		onMouseLeave,
	};
}
