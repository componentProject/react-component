import { ConfigContext } from "./ConfigContext";
import { propsType } from "./types";

export default function ConfigProvider(props: propsType) {
	const { space, locale = "zh-CN", children } = props;

	return <ConfigContext.Provider value={{ space, locale }}>{children}</ConfigContext.Provider>;
}
