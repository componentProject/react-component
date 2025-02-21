import { CSSProperties, type ReactNode } from "react";
import { Color } from "./color";
export interface TransformOffset {
	x: number;
	y: number;
}

export interface TransformProps {
	offset?: TransformOffset;
	children?: ReactNode;
}
export interface HSL {
	h: number | string;
	s: number | string;
	l: number | string;
}

export interface RGB {
	r: number | string;
	g: number | string;
	b: number | string;
}

export interface HSLA extends HSL {
	a: number;
}

export interface RGBA extends RGB {
	a: number;
}

export type ColorType = string | number | RGB | RGBA | HSL | HSLA | Color;

export interface ColorPickerProps {
	className?: string;
	style?: CSSProperties;
	value?: ColorType;
	defaultValue?: ColorType;
	onChange?: (color: Color) => void;
}
