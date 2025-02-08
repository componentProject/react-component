import { useEffect } from "react";

export default function useLifecycles(mount: Function, unmount?: Function) {
	useEffect(() => {
		if (mount) {
			mount();
		}
		return () => {
			if (unmount) {
				unmount();
			}
		};
	}, []);
}
