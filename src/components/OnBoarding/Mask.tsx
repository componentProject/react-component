import React, { CSSProperties, useEffect, useState } from "react";
import { getMaskStyle } from "./getMaskStyle";

import "./index.scss";
import { getId } from "@/components/utils";

interface MaskProps {
	element: HTMLElement;

	container?: HTMLElement;

	renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;

	onAnimationStart?: () => void;

	onAnimationEnd?: () => void;
}

export const Mask: React.FC<MaskProps> = (props) => {
	const { element, renderMaskContent, container, onAnimationStart, onAnimationEnd } = props;

	useEffect(() => {
		onAnimationStart?.();
		const timer = setTimeout(() => {
			onAnimationEnd?.();
		}, 200);

		return () => {
			window.clearTimeout(timer);
		};
	}, [element]);

	const [style, setStyle] = useState<CSSProperties>({});

	const [zIndex, setZIndex] = useState(999);
	useEffect(() => {
		const observer = new ResizeObserver(() => {
			const style = getMaskStyle(element, container || document.documentElement);

			setStyle(style);
		});
		observer.observe(container || document.documentElement);
		setZIndex(getId());
	}, []);
	useEffect(() => {
		if (!element) {
			return;
		}

		element.scrollIntoView({
			block: "center",
			inline: "center",
		});

		const style = getMaskStyle(element, container || document.documentElement);

		setStyle(style);
	}, [element, container]);

	const getContent = () => {
		if (!renderMaskContent) {
			return null;
		}
		return renderMaskContent(<div className={"mask-content"} style={{ width: "100%", height: "100%" }} />);
	};

	return (
		<div
			style={{
				zIndex,
				...style,
			}}
			className="mask"
		>
			{getContent()}
		</div>
	);
};
