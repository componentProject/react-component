import type { FC } from "react";
import classNames from "classnames";

// Handler 的尺寸
type HandlerSize = "default" | "small";

// Handler 的 props
interface HandlerProps {
	// Handler 的尺寸,默认为 default
	size?: HandlerSize;

	// Handler 的背景颜色
	color?: string;
}

// Handler 组件
const Handler: FC<HandlerProps> = ({ size = "default", color }) => {
	// Handler 的 className
	const className = classNames(`color-picker-panel-palette-handler`, {
		// 如果 size 是 small,则添加该 className
		[`color-picker-panel-palette-handler-sm`]: size === "small",
	});

	// Handler 的 style
	const style = {
		// Handler 的背景颜色
		backgroundColor: color,
	};

	return (
		// Handler 的 JSX
		<div className={className} style={style} />
	);
};

// 导出 Handler
export default Handler;
