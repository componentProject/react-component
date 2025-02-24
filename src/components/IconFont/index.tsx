import cs from "classnames";
import { getSize } from "@/components/Icon";
import { IconFontProps } from "@/components/Icon/types";
const loaded = new Set<string>();

/**
 * 用于创建iconfont组件
 * */
export function createFromIconfont(scriptUrl?: string) {
	if (typeof scriptUrl === "string" && scriptUrl.length && !loaded.has(scriptUrl)) {
		const script = document.createElement("script");
		script.setAttribute("src", scriptUrl);
		script.setAttribute("data-namespace", scriptUrl);
		document.body.appendChild(script);
		loaded.add(scriptUrl);
	}
	return (props: IconFontProps) => {
		const { style, className, spin = false, size = "1em", color = "currentColor", type, ...rest } = props;
		if (!type) return null;

		const [width, height] = getSize(size);
		const cn = cs(
			"icon",
			{
				"icon-spin": spin,
			},
			className,
		);
		return (
			<svg
				fill="currentColor"
				viewBox="0 0 1024 1024"
				style={{ color, ...style }}
				className={cn}
				width={width}
				height={height}
				{...rest}
			>
				<use xlinkHref={`#${type}`} />
			</svg>
		);
	};
}
