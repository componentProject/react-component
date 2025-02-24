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

export default function Popover(props: propsType) {
	const { open, onOpenChange, content, children, trigger = "click", placement = "bottom", className, style } = props;

	const arrowRef = useRef(null);

	const [isOpen, setIsOpen] = useState(open);

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

	const hover = useHover(context);
	const click = useClick(context);
	const interaction = trigger === "hover" ? hover : click;

	const dismiss = useDismiss(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([interaction, dismiss]);

	const [zIndex, setZIndex] = useState(999);
	useEffect(() => {
		setZIndex(getId());
	}, []);
	const floating = isOpen && (
		<div className="popover-floating" ref={refs.setFloating} style={{ zIndex, ...floatingStyles }} {...getFloatingProps()}>
			{content}
			<FloatingArrow ref={arrowRef} context={context} fill="#fff" stroke="#000" strokeWidth={1} />
		</div>
	);

	// const el = useMemo(() => {
	// 	const el = document.createElement("div");
	// 	el.className = `wrapper`;
	//
	// 	document.body.appendChild(el);
	// 	return el;
	// }, []);

	const el = document.body;

	return (
		<>
			<span ref={refs.setReference} {...getReferenceProps()} className={className} style={style}>
				{children}
			</span>
			{createPortal(floating, el)}
		</>
	);
}
