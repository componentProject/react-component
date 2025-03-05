import { useEffect, useRef, useState } from "react";
import type { RefObject, MouseEvent as MouseEventForReact } from "react";
import type { TransformOffset } from "./types";
import { Color } from "./color.ts";

/**
 * 事件处理器类型
 */
type EventType = MouseEvent | MouseEventForReact<HTMLDivElement, MouseEvent>;

/**
 * 事件处理器类型
 */
type EventHandle = (e: EventType) => void;

/**
 * useColorDrag的参数接口
 */
interface useColorDragProps {
	/**
	 * 初始偏移
	 */
	offset?: TransformOffset;
	/**
	 * 当前颜色
	 */
	color: Color;
	/**
	 * 容器的引用
	 */
	containerRef: RefObject<HTMLDivElement>;
	/**
	 * 目标元素的引用
	 */
	targetRef: RefObject<HTMLDivElement>;
	/**
	 * 拖拽的限制方向
	 */
	direction?: "x" | "y";
	/**
	 * 拖拽变化时的回调
	 */
	onDragChange?: (offset: TransformOffset) => void;
	/**
	 * 计算初始偏移的函数
	 */
	calculate?: () => TransformOffset;
}

/**
 * useColorDrag hook
 * @param props 参数
 * @returns [当前偏移值, 开始拖拽函数]
 */
function useColorDrag(props: useColorDragProps): [TransformOffset, EventHandle] {
	const { offset, color, targetRef, containerRef, direction, onDragChange, calculate } = props;

	const [offsetValue, setOffsetValue] = useState(offset || { x: 0, y: 0 });
	const dragRef = useRef({
		// 标识是否正在拖拽
		flag: false,
	});

	// 计算偏移的effect
	useEffect(() => {
		if (!dragRef.current.flag) {
			const calcOffset = calculate?.(); // 如果有计算函数，则调用
			if (calcOffset) {
				setOffsetValue(calcOffset); // 更新偏移值
			}
		}
	}, [color]); // 依赖于颜色变化

	// 清除事件监听器的effect
	useEffect(() => {
		document.removeEventListener("mousemove", onDragMove);
		document.removeEventListener("mouseup", onDragStop);
	}, []);

	// 更新偏移值的函数
	const updateOffset: EventHandle = (e) => {
		// 获取页面滚动偏移
		const scrollXOffset = document.documentElement.scrollLeft || document.body.scrollLeft;
		const scrollYOffset = document.documentElement.scrollTop || document.body.scrollTop;

		const pageX = e.pageX - scrollXOffset; // 计算页面X坐标
		const pageY = e.pageY - scrollYOffset; // 计算页面Y坐标

		// 获取容器的位置信息
		const { x: rectX, y: rectY, width, height } = containerRef.current!.getBoundingClientRect();

		// 获取目标元素的尺寸
		const { width: targetWidth, height: targetHeight } = targetRef.current!.getBoundingClientRect();

		const centerOffsetX = targetWidth / 2; // 计算目标的中心偏移
		const centerOffsetY = targetHeight / 2;

		// 计算新偏移值，限制在容器范围内
		const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
		const offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

		const calcOffset = {
			x: offsetX,
			y: direction === "x" ? offsetValue.y : offsetY, // 如果方向是x，则保持y不变
		};

		setOffsetValue(calcOffset); // 更新状态
		onDragChange?.(calcOffset); // 调用回调
	};

	// 停止拖拽的事件处理函数
	const onDragStop: EventHandle = () => {
		document.removeEventListener("mousemove", onDragMove);
		document.removeEventListener("mouseup", onDragStop);

		dragRef.current.flag = false; // 更新拖拽标识
	};

	// 拖拽移动的事件处理函数
	const onDragMove: EventHandle = (e) => {
		e.preventDefault(); // 阻止默认行为
		updateOffset(e); // 更新偏移
	};

	// 开始拖拽的事件处理函数
	const onDragStart: EventHandle = () => {
		document.addEventListener("mousemove", onDragMove);
		document.addEventListener("mouseup", onDragStop);

		dragRef.current.flag = true; // 更新拖拽标识
	};

	return [offsetValue, onDragStart]; // 返回当前偏移值和开始拖拽函数
}

export default useColorDrag;
