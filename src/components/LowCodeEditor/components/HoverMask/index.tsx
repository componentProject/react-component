/**
 * React相关依赖导入
 */
import { useEffect, useMemo, useState } from "react";
/**
 * React DOM Portal工具导入
 * 用于将组件渲染到DOM树中的不同位置
 */
import { createPortal } from "react-dom";
/**
 * 组件状态存储和组件查询工具导入
 */
import { getComponentById, useComponetsStore } from "@/components/LowCodeEditor/stores/components";

/**
 * 组件描述前缀常量
 * 用于生成组件描述元素的ID
 */
const COMPONENT_DESCRIPTION_PREFIX = "component-description-";

/**
 * 悬停遮罩组件的属性接口
 * @interface HoverMaskProps
 */
interface HoverMaskProps {
	/** Portal容器的类名 */
	portalWrapperClassName: string;
	/** 编辑区容器的类名 */
	containerClassName: string;
	/** 当前悬停的组件ID */
	componentId: number;
}

/**
 * 悬停遮罩组件
 *
 * 当鼠标悬停在组件上时，显示一个遮罩层来突出显示该组件
 * 并在右上角显示组件的描述信息
 *
 * @param {HoverMaskProps} props - 组件属性
 * @returns {JSX.Element} 渲染的遮罩层
 */
function HoverMask({ containerClassName, portalWrapperClassName, componentId }: HoverMaskProps) {
	/**
	 * 遮罩层的位置状态
	 */
	const [position, setPosition] = useState({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		labelTop: 0,
		labelLeft: 0,
	});

	/**
	 * 从组件状态存储中获取组件列表
	 */
	const { components } = useComponetsStore();

	/**
	 * 当组件ID变化时更新位置
	 */
	useEffect(() => {
		updatePosition();
	}, [componentId]);

	/**
	 * 当组件列表变化时更新位置
	 */
	useEffect(() => {
		updatePosition();
	}, [components]);

	/**
	 * 更新遮罩层位置
	 * 根据当前悬停组件的DOM位置计算遮罩层的位置
	 */
	function updatePosition() {
		if (!componentId) return;

		const container = document.querySelector(`.${containerClassName}`);
		if (!container) return;

		const node = document.querySelector(`[data-component-id="${componentId}"]`);
		if (!node) return;

		const { top, left, width, height } = node.getBoundingClientRect();
		const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

		let labelTop = top - containerTop + container.scrollTop;
		const labelLeft = left - containerLeft + width;

		if (labelTop <= 0) {
			labelTop -= -20;
		}

		setPosition({
			top: top - containerTop + container.scrollTop,
			left: left - containerLeft + container.scrollTop,
			width,
			height,
			labelTop,
			labelLeft,
		});
	}

	/**
	 * 获取Portal容器元素
	 * 使用useMemo优化性能，避免不必要的DOM查询
	 */
	const el = useMemo(() => {
		return document.querySelector(`.${portalWrapperClassName}`)!;
	}, []);

	/**
	 * 获取当前悬停的组件对象
	 */
	const curComponent = useMemo(() => {
		return getComponentById(componentId, components);
	}, [componentId]);

	/**
	 * 获取当前组件的类型
	 */
	const type = curComponent?.name;

	/**
	 * 通过Portal渲染遮罩层和组件描述
	 */
	return createPortal(
		<>
			{/* 组件轮廓遮罩 - 显示蓝色半透明边框突出显示目标组件 */}
			<div
				style={{
					position: "absolute",
					left: position.left,
					top: position.top,
					backgroundColor: "rgba(0, 0, 255, 0.05)",
					border: "1px dashed blue",
					pointerEvents: "none",
					width: position.width,
					height: position.height,
					zIndex: 12,
					borderRadius: 4,
					boxSizing: "border-box",
				}}
			/>
			{/* 组件描述标签 - 显示组件的类型描述 */}
			<div
				style={{
					position: "absolute",
					left: position.labelLeft,
					top: position.labelTop,
					fontSize: "14px",
					zIndex: 13,
					display: !position.width || position.width < 10 ? "none" : "inline",
					transform: "translate(-100%, -100%)",
				}}
			>
				<div
					style={{
						padding: "0 8px",
						backgroundColor: "blue",
						borderRadius: 4,
						color: "#fff",
						cursor: "pointer",
						whiteSpace: "nowrap",
					}}
				>
					{curComponent?.desc}
				</div>
			</div>
		</>,
		el,
	);
}

export default HoverMask;
