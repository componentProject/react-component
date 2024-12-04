import React from "react";

export type SizeType = 'small' | 'middle' | 'large' | number  | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: React.CSSProperties;
	/**
	 * 子元素的间距,
	 *
	 * 支持传入数组,eg:[横向间距, 纵向间距],
	 *
	 * 也支持传入单个值,eg:间距
	 *
	 * 也可以使用'small' | 'middle' | 'large'
	 *
	 * 也可以使用Provider传递space
	 */
	size?: SizeType | [SizeType, SizeType];
	/**
	 * flex主轴方向: horizontal横向 | vertical纵向
	 */
	direction?: 'horizontal' | 'vertical';
	/**
	 * flex副轴方向: start | end | center | baseline
	 */
	align?: 'start' | 'end' | 'center' | 'baseline';
	split?: React.ReactNode;
	/**
	 * 是否换行,默认否
	 */
	wrap?: boolean;
}
