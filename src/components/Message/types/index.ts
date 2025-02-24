import type { CSSProperties, ReactNode } from "react";

export interface MessageRef {
	add: (messageProps: MessageProps) => number;
	remove: (id: number) => void;
	update: (id: number, messageProps: MessageProps) => void;
	clearAll: () => void;
}

export type Position = "top" | "bottom";

export interface MessageProps {
	style?: CSSProperties;
	className?: string | string[];
	content: ReactNode | string;
	duration?: number;
	onClose?: (...args: any) => void;
	id?: number;
	position?: Position;
}
