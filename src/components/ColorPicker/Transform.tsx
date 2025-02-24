import { forwardRef } from "react";
import type { TransformProps } from "./types";

const Transform = forwardRef<HTMLDivElement, TransformProps>((props, ref) => {
	const { children, offset } = props;
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				left: offset?.x ?? 0,
				top: offset?.y ?? 0,
				zIndex: 1,
			}}
		>
			{children}
		</div>
	);
});

export default Transform;
