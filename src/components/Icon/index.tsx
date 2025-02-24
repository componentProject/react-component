import { forwardRef } from "react";
import { createFromIconfont } from "../IconFont";
import cs from "classnames";

import "./index.scss";

import type { IconProps, IconFontProps } from "@/components/Icon/types";

// eslint-disable-next-line react-refresh/only-export-components
export const getSize = (size: IconProps["size"]) => {
	if (Array.isArray(size) && size.length === 2) {
		return size as string[];
	}

	const width = (size as string) || "1em";
	const height = (size as string) || "1em";

	return [width, height];
};

/** Icon组件,传递scriptUrl可以使用iconfont */
const Icon = forwardRef<HTMLElement, IconFontProps>((props, ref) => {
	const { style, className, spin = false, size = "1em", color = "currentColor", children, scriptUrl, ...rest } = props;

	const [width, height] = getSize(size);

	const cn = cs(
		"icon",
		{
			"icon-spin": spin,
		},
		className,
	);

	let IconComponent = children;
	if (scriptUrl) {
		const IconFont = createFromIconfont(scriptUrl);
		IconComponent = <IconFont {...props} />;
	}
	return (
		<i ref={ref} className={cn} style={{ ...style, width, height, color }} {...rest}>
			{IconComponent}
		</i>
	);
});

export default Icon;
