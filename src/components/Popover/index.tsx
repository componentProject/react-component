import { CSSProperties, PropsWithChildren, ReactNode, useEffect } from "react";
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

type Alignment = "start" | "end";
type Side = "top" | "right" | "bottom" | "left";
type AlignedPlacement = `${Side}-${Alignment}`;
export type placementType = Side | AlignedPlacement;

export interface PopoverProps extends PropsWithChildren {
	content?: ReactNode;
	trigger?: "hover" | "click";
	placement?: placementType;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
	style?: CSSProperties;
}

export default function Popover(props: PopoverProps) {
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

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const interaction = trigger === "hover" ? useHover(context) : useClick(context);

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
