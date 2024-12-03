import React, {forwardRef} from 'react';
import {createFromIconfont} from "../IconFont";
import cs from 'classnames';

import './index.scss';

type BaseIconProps = {
	className?: string;
	style?: React.CSSProperties;
	size?: string | string[];
	spin?: boolean;
};

export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps['size']) => {
	if (Array.isArray(size) && size.length === 2) {
		return size as string[];
	}

	const width = (size as string) || '1em';
	const height = (size as string) || '1em';

	return [width, height];
};




export interface IconFontProps {
	style?: React.CSSProperties;
	scriptUrl?: string;
	type?: string;
	className?: string;
	size?: string | string[];
	spin?: boolean;
	color?: string,
	children?: React.ReactNode
}

/** Icon组件,传递scriptUrl可以使用iconfont */
const Icon = forwardRef((props: IconFontProps, ref) => {
	const {
		style,
		className,
		spin = false,
		size = '1em',
		color = 'currentColor',
		children,
		scriptUrl,
		...rest
	} = props;


	const [width, height] = getSize(size);

	const cn = cs(
		'icon',
		{
			'icon-spin': spin
		},
		className
	)

	let IconComponent = children;
	if (scriptUrl) {
		const IconFont = createFromIconfont(scriptUrl);
		IconComponent = <IconFont {...props} />
	}
	return (
		<i ref={ref} className={cn} style={{...style, width, height, color}} {...rest}>
			{IconComponent}
		</i>
	)
})

export default Icon
