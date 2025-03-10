import { useRef } from "react";
import type { FC } from "react";
import { Color } from "../color.ts";
import Handler from "../Handler.tsx";
import Transform from "../Transform.tsx";
import useColorDrag from "../useColorDrag.ts";
import { calculateColor, calculateOffset } from "../utils.ts";

/**
 * 颜色选择器palette组件
 * @param color 当前选择的颜色
 * @param onChange 颜色选择器变化时的回调函数
 */
const Palette: FC<{
	color: Color;
	onChange?: (color: Color) => void;
}> = ({ color, onChange }) => {
	/**
	 * transformRef是Transform组件的ref对象
	 * transformRef.current是Transform组件的dom
	 */
	const transformRef = useRef<HTMLDivElement>(null);

	/**
	 * containerRef是容器的ref对象
	 * containerRef.current是容器的dom
	 */
	const containerRef = useRef<HTMLDivElement>(null);

	/**
	 *  useColorDrag  hook
	 *  offset是当前选择的颜色对应的偏移量
	 *  dragStartHandle是拖拽开始时的回调函数
	 */
	const [offset, dragStartHandle] = useColorDrag({
		/**
		 * containerRef是容器的ref对象
		 * containerRef.current是容器的dom
		 */
		containerRef,
		/**
		 * targetRef是Transform组件的ref对象
		 * targetRef.current是Transform组件的dom
		 */
		targetRef: transformRef,
		color,
		/**
		 * onDragChange是拖拽时的回调函数
		 *  offsetValue是当前选择的颜色对应的偏移量
		 */
		onDragChange: (offsetValue) => {
			/**
			 * calculateColor 函数根据偏移量和当前选择的颜色,计算出新的颜色
			 */
			const newColor = calculateColor({
				offset: offsetValue,
				containerRef,
				targetRef: transformRef,
				color,
			});
			/**
			 * onChange是props传递的回调函数
			 * newColor是当前选择的颜色
			 */
			onChange?.(newColor);
		},
		/**
		 * calculate是计算偏移量的函数
		 */
		calculate: () => {
			/**
			 * calculateOffset 函数根据容器和Transform组件的dom,计算出当前选择的颜色对应的偏移量
			 */
			return calculateOffset(containerRef, transformRef, color);
		},
	});

	return (
		<div
			/**
			 * containerRef是容器的ref对象
			 * containerRef.current是容器的dom
			 */
			ref={containerRef}
			className="color-picker-panel-palette"
			onMouseDown={dragStartHandle}
		>
			<Transform
				/**
				 * transformRef是Transform组件的ref对象
				 * transformRef.current是Transform组件的dom
				 */
				ref={transformRef}
				/**
				 * offset是当前选择的颜色对应的偏移量
				 */
				offset={{ x: offset.x, y: offset.y }}
			>
				<Handler color={color.toRgbString()} />
			</Transform>
			<div
				className={`color-picker-panel-palette-main`}
				style={{
					backgroundColor: `hsl(${color.toHsl().h},100%, 50%)`,
					backgroundImage: "linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))",
				}}
			/>
		</div>
	);
};

export default Palette;
