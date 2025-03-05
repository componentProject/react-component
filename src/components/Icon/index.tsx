import { forwardRef } from "react";
import { createFromIconfont } from "../IconFont";
import cs from "classnames";

import "./index.scss";

import type { IconProps, IconFontProps } from "@/components/Icon/types";

/**
 * 根据传入的size参数计算宽度和高度
 * 如果size是数组且长度为2，则直接返回
 * 否则，将size视为字符串，并设置默认值为"1em"
 */
export const getSize = (size: IconProps["size"]) => {
	if (Array.isArray(size) && size.length === 2) {
		return size as string[];
	}

	const width = (size as string) || "1em";
	const height = (size as string) || "1em";

	return [width, height];
};

/**
 * Icon组件，支持通过scriptUrl引入iconfont
 * 使用forwardRef将ref转发到i元素
 */
const Icon = forwardRef<HTMLElement, IconFontProps>((props, ref) => {
	/**
	 * 从props中解构出各个参数
	 * style: 自定义样式
	 * className: 自定义类名
	 * spin: 是否旋转图标，默认false
	 * size: 图标大小，默认"1em"
	 * color: 图标颜色，默认"currentColor"
	 * children: 子元素
	 * scriptUrl: iconfont脚本URL
	 * rest: 其余未解构的props
	 */
	const { style, className, spin = false, size = "1em", color = "currentColor", children, scriptUrl, ...rest } = props;

	/**
	 * 获取图标宽度和高度
	 */
	const [width, height] = getSize(size);

	/**
	 * 计算图标的类名
	 * 如果spin为true，则添加"icon-spin"类
	 */
	const cn = cs(
		"icon",
		{
			"icon-spin": spin,
		},
		className,
	);

	/**
	 * 如果提供了scriptUrl，则通过createFromIconfont创建IconFont组件
	 * 否则直接渲染children
	 */
	let IconComponent = children;
	if (scriptUrl) {
		const IconFont = createFromIconfont(scriptUrl);
		IconComponent = <IconFont {...props} />;
	}

	/**
	 * 返回一个i元素，作为图标的容器
	 * 将传递进来的ref赋予这个i元素
	 * 设置图标的类名、样式、宽度、高度和颜色
	 * 渲染IconComponent作为子元素
	 */
	return (
		<i ref={ref} className={cn} style={{ ...style, width, height, color }} {...rest}>
			{IconComponent}
		</i>
	);
});

export default Icon;
