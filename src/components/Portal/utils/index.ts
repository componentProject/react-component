import type {PortalProps} from "../types";

export function getAttach(attach: PortalProps['attach']) {
	if (typeof attach === 'string') {
		return document.querySelector(attach);
	}
	if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
		return attach;
	}

	return document.body;
}
