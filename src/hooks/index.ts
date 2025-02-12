// const hookFiles = import.meta.glob('../hooks/*.ts', { eager: true, import: 'default' })
// const hooks = Object.keys(hookFiles).reduce((modules = {}, modulePath) => {
// 	const name = modulePath.split('/').at(-1)?.replace('.ts', '')
// 	const hook = hookFiles[modulePath]
// 	if(!name)return modules;
// 	modules[name]=hook
// 	return modules
// }, {})
// export default hooks
import useCookie from "@/hooks/useCookie.ts";
import useCountDown from "@/hooks/useCountDown.ts";
import useHover from "@/hooks/useHover.ts";
import useLifecycles from "@/hooks/useLifecycles.ts";
import useMountedState from "@/hooks/useMountedState.ts";
import useScrolling from "@/hooks/useScrolling.ts";
import useSize from "@/hooks/useSize.ts";
import useTimeout from "@/hooks/useTimeout.ts";
import useWhyDidYouUpdate from "@/hooks/useWhyDidYouUpdate.ts";
export {
	useCookie,
	useCountDown,
	useHover,
	useLifecycles,
	useMountedState,
	useScrolling,
	useSize,
	useTimeout,
	useWhyDidYouUpdate,
};
export default {
	useCookie,
	useCountDown,
	useHover,
	useLifecycles,
	useMountedState,
	useScrolling,
	useSize,
	useTimeout,
	useWhyDidYouUpdate,
};
