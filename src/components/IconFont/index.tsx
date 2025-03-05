import cs from "classnames";
import { getSize } from "@/components/Icon";
import type { IconFontProps } from "@/components/Icon/types";

/** 已加载的 scriptUrl 集合 */
const loaded = new Set<string>();

/**
 * 用于创建 iconfont 组件的函数
 *
 * @param scriptUrl 可选的 script URL 字符串, 用于加载 iconfont
 * @returns 返回一个 React 组件，用于渲染指定类型的图标
 */
export function createFromIconfont(scriptUrl?: string) {
	/**
	 * 检查 scriptUrl 是否为有效字符串且尚未加载
	 * 如果是，则创建并附加 <script> 标签到文档中
	 */
	if (typeof scriptUrl === "string" && scriptUrl.length && !loaded.has(scriptUrl)) {
		const script = document.createElement("script");
		script.setAttribute("src", scriptUrl);
		script.setAttribute("data-namespace", scriptUrl);
		document.body.appendChild(script);
		loaded.add(scriptUrl);
	}

	/**
	 * 返回一个 React 组件
	 *
	 * @param props 组件的属性, 包括样式、类名、是否旋转、尺寸、颜色、类型等
	 * @returns 如果未提供类型, 返回 null; 否则返回一个 <svg> 元素
	 */
	return (props: IconFontProps) => {
		const { style, className, spin = false, size = "1em", color = "currentColor", type, ...rest } = props;
		if (!type) return null;

		/**
		 * 使用 getSize 函数解析尺寸
		 * @returns [width, height] 数组
		 */
		const [width, height] = getSize(size);

		/**
		 * 使用 classnames 库计算类名
		 * 包括基础类名和可选的旋转类名
		 */
		const cn = cs(
			"icon",
			{
				"icon-spin": spin,
			},
			className,
		);

		/**
		 * 返回一个 <svg> 元素
		 * 使用 <use> 元素引用图标类型
		 */
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
