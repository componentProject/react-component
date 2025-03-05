import type { ReactNode, HTMLAttributes, CSSProperties } from "react";

/**
 * 定义SizeType类型，用于表示尺寸类型
 */
export type SizeType = "small" | "middle" | "large" | number | undefined;

/**
 * 定义propsType接口，继承自React的HTMLDivElement属性接口
 */
export interface propsType extends HTMLAttributes<HTMLDivElement> {
	/**
	 * 用于分割每个子元素的元素
	 */
	split?: ReactNode;

	/**
	 * 自定义类名
	 */
	className?: string;

	/**
	 * 自定义样式
	 */
	style?: CSSProperties;

	/**
	 * 子元素的间距
	 *
	 * 可以传入数组，例如：[横向间距, 纵向间距]
	 *
	 * 也可以传入单个值，例如：间距
	 *
	 * 还可以使用 'small' | 'middle' | 'large'
	 *
	 * 也可以通过 Provider 传递 space
	 */
	size?: SizeType | [SizeType, SizeType];

	/**
	 * flex 主轴方向：horizontal 横向 | vertical 纵向
	 */
	direction?: "horizontal" | "vertical";

	/**
	 * flex 副轴方向：start | end | center | baseline
	 */
	align?: "start" | "end" | "center" | "baseline";

	/**
	 * 是否换行，默认值为否
	 */
	wrap?: boolean;
}
