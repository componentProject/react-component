import type {ReactNode} from 'react'
export interface PortalProps {
	attach?: HTMLElement | string;
	children: ReactNode;
}
