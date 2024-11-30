import React, {forwardRef} from 'react';
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

const loaded = new Set<string>();

/**
 * 用于创建iconfont组件
 * */
export function createFromIconfont(scriptUrl) {
	if (
		typeof scriptUrl === 'string'
		&& scriptUrl.length
		&& !loaded.has(scriptUrl)
	) {
		const script = document.createElement('script');
		script.setAttribute('src', scriptUrl);
		script.setAttribute('data-namespace', scriptUrl);
		document.body.appendChild(script);
		loaded.add(scriptUrl);
	}
	const Iconfont = (props) => {
		const {
			style,
			className,
			spin = false,
			size = '1em',
			color = 'currentColor',
			type,
			...rest
		} = props;
		if (!type) return null;

		const [width, height] = getSize(size);
		const cn = cs(
			'icon',
			{
				'icon-spin': spin
			},
			className
		)
		return (<svg fill="currentColor" viewBox="0 0 1024 1024" style={{color, ...style}} className={cn} width={width}
								 height={height} {...rest}>
			<use xlinkHref={`#${type}`}/>
		</svg>);
	}
	return Iconfont;
}


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
