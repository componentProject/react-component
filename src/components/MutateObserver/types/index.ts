import type { ReactElement } from "react";

export interface propsType {
	options?: MutationObserverInit;
	onMutate?: (mutations: MutationRecord[], observer: MutationObserver) => void;
	children: ReactElement;
}
