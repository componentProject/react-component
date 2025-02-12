import { useEffect, useRef } from "react";

export type IProps = Record<string, any>;

/**
 * 获取哪些 props 改变导致的重新渲染
 * @param componentName
 * @param props
 * @return {{from: *, to: *}}
 */
export default function useWhyDidYouUpdate(componentName: string, props: IProps) {
	const prevProps = useRef<IProps>({});

	useEffect(() => {
		if (prevProps.current) {
			const allKeys = Object.keys({ ...prevProps.current, ...props });
			const changedProps: IProps = {};

			allKeys.forEach((key) => {
				if (!Object.is(prevProps.current[key], props[key])) {
					changedProps[key] = {
						from: prevProps.current[key],
						to: props[key],
					};
				}
			});

			if (Object.keys(changedProps).length) {
				console.log("[why-did-you-update]", componentName, changedProps);
			}
		}

		prevProps.current = props;
	});
}
