import React from "react";

type BaseIconProps = {
	className?: string;
	style?: React.CSSProperties;
	size?: string | string[];
	spin?: boolean;
};

export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export interface IconFontProps {
	style?: React.CSSProperties;
	scriptUrl?: string;
	type?: string;
	className?: string;
	size?: string | string[];
	spin?: boolean;
	color?: string;
	children?: React.ReactNode;
}
