import "./index.scss";
import { ConfigContext } from "../ConfigProvider";
import { Children, useContext, useMemo } from "react";
import type { FC, CSSProperties } from "react";
import classNames from "classnames";
import { propsType, SizeType } from "./types";

/**
 *  spaceSize是Space组件的spacingSize的配置对象
 *  该对象的key是SizeType的字符串值，value是number类型的值
 *  该对象的作用是将SizeType的字符串值转换为number类型的值
 */
const spaceSize = {
	small: 8,
	middle: 16,
	large: 24,
};

/**
 *  getNumberSize是将SizeType的值转换为number类型的值
 *  该函数的参数size是SizeType类型的值
 *  该函数的返回值是number类型的值
 */
function getNumberSize(size: SizeType) {
	return typeof size === "string" ? spaceSize[size] : size || 0;
}

const Space: FC<propsType> = ({
	// className是Space组件的类名
	className,
	// style是Space组件的样式
	style,
	// children是Space组件的子元素
	children,
	/**
	 *  size是Space组件的spacingSize的配置
	 *  该参数的类型是SizeType类型的值
	 *  该参数的默认值是"small"
	 */
	size = "small",
	/**
	 *  direction是Space组件的方向
	 *  该参数的类型是"horizontal" | "vertical"
	 *  该参数的默认值是"horizontal"
	 */
	direction = "horizontal",
	/**
	 *  align是Space组件的对齐方式
	 *  该参数的类型是"start" | "end" | "center" | "baseline"
	 *  该参数的默认值是undefined
	 */
	align,
	// split是Space组件的分隔符
	split,
	/**
	 *  wrap是Space组件的是否换行
	 *  该参数的类型是boolean
	 *  该参数的默认值是false
	 */
	wrap = false,
	...otherProps
}: propsType) => {
	/**
	 *  space是Space组件的spacingSize的配置
	 *  该参数的类型是SizeType类型的值
	 *  该参数的默认值是size
	 */
	const { space } = useContext(ConfigContext);
	size = space || size;
	const childNodes = Children.toArray(children);

	const mergedAlign = direction === "horizontal" && align === undefined ? "center" : align;
	const cn = classNames(
		"space",
		`space-${direction}`,
		{
			[`space-align-${mergedAlign}`]: mergedAlign,
		},
		className,
	);

	const nodes = childNodes.map((child: any, i) => {
		const key = (child && child.key) || `space-item-${i}`;

		return (
			<>
				<div className="space-item" key={key}>
					{child}
				</div>
				{i < childNodes.length && split && (
					<span className={`${className}-split`} style={{ height: "100%", ...style }}>
						{split}
					</span>
				)}
			</>
		);
	});

	const otherStyles: CSSProperties = {};

	const [horizontalSize, verticalSize] = useMemo(
		() => ((Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]).map((item) => getNumberSize(item)),
		[size],
	);

	otherStyles.columnGap = horizontalSize;
	otherStyles.rowGap = verticalSize;

	if (wrap) {
		otherStyles.flexWrap = "wrap";
	}

	return (
		<div
			className={cn}
			style={{
				...otherStyles,
				...style,
			}}
			{...otherProps}
		>
			{nodes}
		</div>
	);
};

export default Space;
