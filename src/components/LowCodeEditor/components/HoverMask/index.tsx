/**
 * 导入React相关依赖
 */
import { useEffect, useMemo, useState } from "react";
/**
 * 导入React DOM Portal工具
 * 用于将组件渲染到DOM树中的不同位置
 */
import { createPortal } from "react-dom";
/**
 * 导入组件状态存储和组件查询工具
 * - useComponetsStore: 组件状态管理Hook
 * - getComponentById: 根据ID查找特定组件的工具函数
 */
import { getComponentById, useComponetsStore } from "../../stores/components";

/**
 * 悬停遮罩组件的属性接口
 * @interface HoverMaskProps
 */
interface HoverMaskProps {
	/** Portal容器的类名，用于确定遮罩层渲染的目标容器 */
	portalWrapperClassName: string;
	/** 编辑区容器的类名，用于计算相对位置 */
	containerClassName: string;
	/** 当前悬停的组件ID，用于定位和获取组件信息 */
	componentId: number;
}

/**
 * 悬停遮罩组件
 *
 * 当鼠标悬停在组件上时，显示一个遮罩层来突出显示该组件
 * 并在右上角显示组件的描述信息。通过Portal技术实现，
 * 确保遮罩层可以正确定位在目标组件上方。
 *
 * @param {HoverMaskProps} props 组件属性
 * @returns {JSX.Element} 渲染的遮罩层
 */
function HoverMask({ containerClassName, portalWrapperClassName, componentId }: HoverMaskProps) {
	/**
	 * 遮罩层的位置状态
	 * @property {number} left - 遮罩层左侧位置
	 * @property {number} top - 遮罩层顶部位置
	 * @property {number} width - 遮罩层宽度
	 * @property {number} height - 遮罩层高度
	 * @property {number} labelTop - 标签顶部位置
	 * @property {number} labelLeft - 标签左侧位置
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
	 * 用于访问当前编辑器中所有组件的状态
	 */
	const { components } = useComponetsStore();

	/**
	 * 当组件ID变化时更新位置
	 * 确保当用户悬停在不同组件上时遮罩层能正确跟随
	 */
	useEffect(() => {
		updatePosition();
	}, [componentId]);

	/**
	 * 当组件列表变化时更新位置
	 * 确保当组件树结构变化时遮罩层能保持正确位置
	 */
	useEffect(() => {
		updatePosition();
	}, [components]);

	/**
	 * 更新遮罩层位置
	 * 根据当前悬停组件的DOM位置计算遮罩层的位置
	 * 考虑了容器的滚动位置和相对偏移
	 */
	function updatePosition() {
		if (!componentId) return;

		const container = document.querySelector(`.${containerClassName}`);
		if (!container) return;

		const node = document.querySelector(`[data-component-id="${componentId}"]`);
		if (!node) return;

		const { top, left, width, height } = node.getBoundingClientRect();
		const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

		const labelTop = top - containerTop + container.scrollTop;
		const labelLeft = left - containerLeft + width;

		// 确保标签不会超出可视区域顶部
		const adjustedLabelTop = labelTop <= 0 ? labelTop - -20 : labelTop;

		setPosition({
			top: top - containerTop + container.scrollTop,
			left: left - containerLeft + container.scrollTop,
			width,
			height,
			labelTop: adjustedLabelTop,
			labelLeft,
		});
	}

	/**
	 * 获取Portal容器元素
	 * 使用useMemo优化性能，避免不必要的DOM查询
	 * @returns {Element} Portal容器DOM元素
	 */
	const el = useMemo(() => {
		return document.querySelector(`.${portalWrapperClassName}`)!;
	}, []);

	/**
	 * 获取当前悬停的组件对象
	 * 根据componentId从组件列表中查找对应的组件数据
	 * @returns {Component|undefined} 当前悬停的组件对象
	 */
	const curComponent = useMemo(() => {
		return getComponentById(componentId, components);
	}, [componentId]);

	/**
	 * 通过Portal渲染遮罩层和组件描述标签
	 * 将遮罩层渲染到指定的DOM容器中，而不是组件树的当前位置
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
					pointerEvents: "none", // 确保遮罩不会拦截鼠标事件
					width: position.width,
					height: position.height,
					zIndex: 12,
					borderRadius: 4,
					boxSizing: "border-box",
				}}
			/>
			{/* 组件描述标签 - 显示组件的描述信息 */}
			<div
				style={{
					position: "absolute",
					left: position.labelLeft,
					top: position.labelTop,
					fontSize: "14px",
					zIndex: 13,
					display: !position.width || position.width < 10 ? "none" : "inline", // 组件太小时不显示标签
					transform: "translate(-100%, -100%)", // 将标签定位到组件右上角
				}}
			>
				<div
					style={{
						padding: "0 8px",
						backgroundColor: "blue",
						borderRadius: 4,
						color: "#fff",
						cursor: "pointer",
						whiteSpace: "nowrap", // 防止标签文本换行
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
