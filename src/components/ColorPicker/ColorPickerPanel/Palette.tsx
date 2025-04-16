/** 导入useRef hook */
import { useRef } from "react";
/** 导入FC类型 */
import type { FC } from "react";
/** 导入Color类 */
import { Color } from "../color.ts";
/** 导入Handler组件 */
import Handler from "../Handler.tsx";
/** 导入Transform组件 */
import Transform from "../Transform.tsx";
/** 导入useColorDrag hook */
import useColorDrag from "../useColorDrag.ts";
/** 导入calculateColor和calculateOffset工具函数 */
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
		/**
		 * color是当前选择的颜色
		 */
		color,
		/**
		 * onDragChange是拖拽时的回调函数
		 *  offsetValue是当前选择的颜色对应的偏移量
		 */
		onDragChange: (offsetValue) => {
			/**
			 * calculateColor是计算颜色的工具函数
			 * offsetValue是当前选择的颜色对应的偏移量
			 * containerRef.current是容器的dom
			 */
			const newColor = calculateColor({
				offset: offsetValue,
				containerRef: containerRef.current,
				targetRef: transformRef.current,
				color,
			});
			/**
			 * onChange是props传递的回调函数
			 * newColor是计算出的新颜色
			 */
			onChange?.(newColor);
		},
	});

	/**
	 * calculateOffset是计算偏移量的工具函数
	 * color是当前选择的颜色
	 * containerRef.current是容器的dom
	 * transformRef.current是Transform组件的dom
	 */
	const offsetValue = calculateOffset(containerRef.current, transformRef.current, color);

	/**
	 * Palette的渲染
	 */
	return (
		/**
		 * 渲染颜色选择器容器
		 */
		<div
			/**
			 * ref是容器的ref对象
			 */
			ref={containerRef}
			/**
			 * className是容器的class name
			 */
			className="color-picker-panel-palette"
			/**
			 * onMouseDown是鼠标按下时的回调函数
			 * dragStartHandle是拖拽开始时的回调函数
			 */
			onMouseDown={dragStartHandle}
		>
			/** * 渲染Transform组件 */
			<Transform
				/**
				 * ref是Transform组件的ref对象
				 */
				ref={transformRef}
				/**
				 * offset是当前选择的颜色对应的偏移量
				 */
				offset={offset}
			>
				/** * 渲染Handler组件 */
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
