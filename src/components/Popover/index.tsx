import { useEffect } from "react";
import type { propsType } from "./types";
import {
	useInteractions,
	useFloating,
	useClick,
	useDismiss,
	offset,
	arrow,
	FloatingArrow,
	flip,
	useHover,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import "./index.css";
import { createPortal } from "react-dom";
import { getId } from "@/utils";

/**
 * 定义 Popover 组件
 * @param props 组件的属性
 */
export default function Popover(props: propsType) {
	/**
	 * 从 props 中解构出各个属性
	 * open: 弹出层是否打开
	 * onOpenChange: 弹出层状态改变的回调函数
	 * content: 弹出层的内容
	 * children: 子元素
	 * trigger: 触发方式，默认为 "click"
	 * placement: 弹出层位置，默认为 "bottom"
	 * className: 自定义类名
	 * style: 自定义样式
	 */
	const { open, onOpenChange, content, children, trigger = "click", placement = "bottom", className, style } = props;

	/** 用于存储箭头元素的引用 */
	const arrowRef = useRef(null);

	/** 控制弹出层状态的本地状态 */
	const [isOpen, setIsOpen] = useState(open);

	/**
	 * 使用 useFloating 钩子来处理浮动元素
	 * refs: 引用对象，用于设置浮动元素和参考元素的引用
	 * floatingStyles: 用于浮动元素的样式
	 * context: 上下文对象，用于浮动元素的交互
	 */
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: (open: boolean) => {
			setIsOpen(open);
			onOpenChange?.(open);
		},
		placement,
		middleware: [
			offset(10),
			arrow({
				element: arrowRef,
			}),
			flip(),
		],
	});

	/** 选择交互方式：悬停或点击 */
	const hover = useHover(context);
	const click = useClick(context);
	const interaction = trigger === "hover" ? hover : click;

	/** 设置用来关闭弹出层的交互 */
	const dismiss = useDismiss(context);

	/** 获取参考元素和浮动元素的属性 */
	const { getReferenceProps, getFloatingProps } = useInteractions([interaction, dismiss]);

	/** 用于存储弹出层的 zIndex */
	const [zIndex, setZIndex] = useState(999);

	/** 组件挂载时，设置 zIndex */
	useEffect(() => {
		setZIndex(getId());
	}, []);

	/**
	 * 如果弹出层打开，渲染浮动元素
	 * 使用 FloatingArrow 组件作为箭头
	 */
	const floating = isOpen && (
		<div className="popover-floating" ref={refs.setFloating} style={{ zIndex, ...floatingStyles }} {...getFloatingProps()}>
			{content}
			<FloatingArrow ref={arrowRef} context={context} fill="#fff" stroke="#000" strokeWidth={1} />
		</div>
	);

	/** 弹出层挂载的 DOM 节点 */
	const el = document.body;

	/**
	 * 返回渲染的 JSX 元素
	 * 使用 createPortal 将浮动元素挂载到指定的 DOM 节点
	 */
	return (
		<>
			<span ref={refs.setReference} {...getReferenceProps()} className={className} style={style}>
				{children}
			</span>
			{createPortal(floating, el)}
		</>
	);
}
