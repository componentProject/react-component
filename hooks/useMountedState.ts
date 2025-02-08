import { useCallback, useEffect, useRef } from "react";

/**
 * 获取组件是否 mount 到 dom
 */
export default function useMountedState(): () => boolean {
	const mountedRef = useRef<boolean>(false);
	const get = useCallback(() => mountedRef.current, []);

	useEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	return get;
}
