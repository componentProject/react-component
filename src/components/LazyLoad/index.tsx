import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import type { propsType } from "./types";

const Index: FC<propsType> = ({ className = "", style, offset, width, onContentVisible, placeholder, height, children }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	const elementObserver = useRef<IntersectionObserver>();

	function lazyLoadHandler(entries: IntersectionObserverEntry[]) {
		const [entry] = entries;
		const { isIntersecting } = entry;

		if (isIntersecting) {
			setVisible(true);
			onContentVisible?.();

			const node = containerRef.current;
			if (node && node instanceof HTMLElement) {
				elementObserver.current?.unobserve(node);
			}
		}
	}
	useEffect(() => {
		const options = {
			rootMargin: typeof offset === "number" ? `${offset}px` : offset,
			threshold: 0,
		};

		elementObserver.current = new IntersectionObserver(lazyLoadHandler, options);

		const node = containerRef.current;

		if (node instanceof HTMLElement) {
			elementObserver.current.observe(node);
		}
		return () => {
			if (node && node instanceof HTMLElement) {
				elementObserver.current?.unobserve(node);
			}
		};
	}, []);

	const styles = { height, width, ...style };

	return (
		<div ref={containerRef} className={className} style={styles}>
			{visible ? children : placeholder}
		</div>
	);
};

export default Index;
