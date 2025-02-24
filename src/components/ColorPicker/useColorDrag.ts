import { useEffect, useRef, useState } from "react";
import type { RefObject, MouseEvent as MouseEventForReact } from "react";
import type { TransformOffset } from "./types";
import { Color } from "./color.ts";
type EventType = MouseEvent | MouseEventForReact<HTMLDivElement, MouseEvent>;

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
	offset?: TransformOffset;
	color: Color;
	containerRef: RefObject<HTMLDivElement>;
	targetRef: RefObject<HTMLDivElement>;
	direction?: "x" | "y";
	onDragChange?: (offset: TransformOffset) => void;
	calculate?: () => TransformOffset;
}

function useColorDrag(props: useColorDragProps): [TransformOffset, EventHandle] {
	const { offset, color, targetRef, containerRef, direction, onDragChange, calculate } = props;

	const [offsetValue, setOffsetValue] = useState(offset || { x: 0, y: 0 });
	const dragRef = useRef({
		flag: false,
	});

	useEffect(() => {
		if (!dragRef.current.flag) {
			const calcOffset = calculate?.();
			if (calcOffset) {
				setOffsetValue(calcOffset);
			}
		}
	}, [color]);

	useEffect(() => {
		document.removeEventListener("mousemove", onDragMove);
		document.removeEventListener("mouseup", onDragStop);
	}, []);

	const updateOffset: EventHandle = (e) => {
		const scrollXOffset = document.documentElement.scrollLeft || document.body.scrollLeft;
		const scrollYOffset = document.documentElement.scrollTop || document.body.scrollTop;

		const pageX = e.pageX - scrollXOffset;
		const pageY = e.pageY - scrollYOffset;

		const { x: rectX, y: rectY, width, height } = containerRef.current!.getBoundingClientRect();

		const { width: targetWidth, height: targetHeight } = targetRef.current!.getBoundingClientRect();

		const centerOffsetX = targetWidth / 2;
		const centerOffsetY = targetHeight / 2;

		const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
		const offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

		const calcOffset = {
			x: offsetX,
			y: direction === "x" ? offsetValue.y : offsetY,
		};

		setOffsetValue(calcOffset);
		onDragChange?.(calcOffset);
	};

	const onDragStop: EventHandle = () => {
		document.removeEventListener("mousemove", onDragMove);
		document.removeEventListener("mouseup", onDragStop);

		dragRef.current.flag = false;
	};

	const onDragMove: EventHandle = (e) => {
		e.preventDefault();
		updateOffset(e);
	};

	const onDragStart: EventHandle = () => {
		document.addEventListener("mousemove", onDragMove);
		document.addEventListener("mouseup", onDragStop);

		dragRef.current.flag = true;
	};

	return [offsetValue, onDragStart];
}

export default useColorDrag;
