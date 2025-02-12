import { useEffect } from "react";

/**
 * 监听元素的挂载和卸载
 * @param mount 挂载callback
 * @param unmount 卸载callback
 */
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
