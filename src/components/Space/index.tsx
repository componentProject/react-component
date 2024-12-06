import './index.scss';
import {ConfigContext} from './ConfigProvider/ConfigProvider.tsx';
import React from "react";
import classNames from "classnames";
import {SpaceProps, SizeType} from "./Space.ts";

const spaceSize = {
	small: 8,
	middle: 16,
	large: 24,
};

function getNumberSize(size: SizeType) {
	return typeof size === 'string' ? spaceSize[size] : size || 0;
}

const Space: React.FC<SpaceProps> = ({
																			 className,
																			 style,
																			 children,
																			 size = 'small',
																			 direction = 'horizontal',
																			 align,
																			 split,
																			 wrap = false,
																			 ...otherProps
																		 }: SpaceProps) => {

	const {space} = React.useContext(ConfigContext);
	size = space || size;
	const childNodes = React.Children.toArray(children);

	const mergedAlign = direction === 'horizontal' && align === undefined ? 'center' : align;
	const cn = classNames('space',
		`space-${direction}`,
		{
			[`space-align-${mergedAlign}`]: mergedAlign,
		},
		className,
	);

	const nodes = childNodes.map((child: object, i) => {

		const key = child && child.key || `space-item-${i}`;

		return <>
			<div className='space-item' key={key}>
				{child}
			</div>
			{i < childNodes.length && split && (
				<span className={`${className}-split`} style={{height: '100%',...style}}>
                {split}
            </span>
			)}
		</>
	});

	const otherStyles: React.CSSProperties = {};

	const [horizontalSize, verticalSize] = React.useMemo(
		() =>
			((Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]).map(item =>
				getNumberSize(item),
			),
		[size]
	);

	otherStyles.columnGap = horizontalSize;
	otherStyles.rowGap = verticalSize;

	if (wrap) {
		otherStyles.flexWrap = 'wrap';
	}

	return <div
		className={cn}
		style={{
			...otherStyles,
			...style
		}}
		{...otherProps}
	>
		{nodes}
	</div>
};

export default Space;
