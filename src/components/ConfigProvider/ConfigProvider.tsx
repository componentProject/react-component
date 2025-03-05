import { ConfigContext } from "./ConfigContext";
import type { propsType } from "./types";

/**
 * ConfigProvider组件
 * @param props 组件的属性
 * 包含space和locale两个可选属性，以及子组件children
 */
export default function ConfigProvider(props: propsType) {
	/**
	 * 从props中解构出space, locale和children
	 * locale默认为"zh-CN"（简体中文）
	 */
	const { space, locale = "zh-CN", children } = props;

	/**
	 * 使用Provider组件传递context
	 * 将space和locale作为context的值传递给子组件
	 */
	return <ConfigContext.Provider value={{ space, locale }}>{children}</ConfigContext.Provider>;
}
