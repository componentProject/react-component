/**
 * 导入React相关依赖
 */
import React, { MouseEventHandler, useEffect, useState } from "react";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "@/components/LowCodeEditor/stores/component-config";
/**
 * 导入组件状态存储
 */
import { Component, useComponetsStore } from "@/components/LowCodeEditor/stores/components";
/**
 * 导入悬停遮罩组件
 */
import HoverMask from "@/components/LowCodeEditor/components/HoverMask";
/**
 * 导入选中遮罩组件
 */
import SelectedMask from "@/components/LowCodeEditor/components/SelectedMask";

/**
 * 编辑区域组件
 *
 * 提供组件渲染和交互功能，包括组件悬停和选中效果
 * 作为低代码编辑器的核心区域，负责展示组件树和处理用户交互
 *
 * @returns {JSX.Element} 编辑区域组件
 */
export function EditArea() {
	/**
	 * 从组件状态存储中获取组件列表和当前选中组件信息
	 */
	const { components, curComponentId, setCurComponentId } = useComponetsStore();
	/**
	 * 获取组件配置信息
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 递归渲染组件树
	 * 根据组件配置和属性创建React元素
	 *
	 * @param {Component[]} components - 要渲染的组件数组
	 * @returns {React.ReactNode} 渲染的组件树
	 */
	function renderComponents(components: Component[]): React.ReactNode {
		return components.map((component: Component) => {
			const config = componentConfig?.[component.name];

			if (!config?.dev) {
				return null;
			}

			return React.createElement(
				config.dev,
				{
					key: component.id,
					id: component.id,
					name: component.name,
					styles: component.styles,
					...config.defaultProps,
					...component.props,
				},
				renderComponents(component.children || []),
			);
		});
	}

	/**
	 * 当前悬停的组件ID
	 */
	const [hoverComponentId, setHoverComponentId] = useState<number>();

	/**
	 * 处理鼠标悬停事件
	 * 获取鼠标下方组件的ID并设置为当前悬停组件
	 *
	 * @param {React.MouseEvent} e - 鼠标事件对象
	 */
	const handleMouseOver: MouseEventHandler = (e) => {
		const path = e.nativeEvent.composedPath();

		for (let i = 0; i < path.length; i += 1) {
			const ele = path[i] as HTMLElement;

			const componentId = ele.dataset?.componentId;
			if (componentId) {
				setHoverComponentId(+componentId);
				return;
			}
		}
	};

	/**
	 * 处理鼠标点击事件
	 * 获取点击位置组件的ID并设置为当前选中组件
	 *
	 * @param {React.MouseEvent} e - 鼠标事件对象
	 */
	const handleClick: MouseEventHandler = (e) => {
		const path = e.nativeEvent.composedPath();

		for (let i = 0; i < path.length; i += 1) {
			const ele = path[i] as HTMLElement;

			const componentId = ele.dataset?.componentId;
			if (componentId) {
				setCurComponentId(+componentId);
				return;
			}
		}
	};

	/**
	 * 渲染编辑区域组件
	 */
	return (
		<div
			className="h-[100%] edit-area"
			onMouseOver={handleMouseOver}
			onMouseLeave={() => {
				setHoverComponentId(undefined);
			}}
			onClick={handleClick}
		>
			{/* 渲染组件树 */}
			{renderComponents(components)}
			{/* 悬停遮罩 - 当有组件被悬停且不是当前选中组件时显示 */}
			{hoverComponentId && hoverComponentId !== curComponentId && (
				<HoverMask portalWrapperClassName="portal-wrapper" containerClassName="edit-area" componentId={hoverComponentId} />
			)}
			{/* 选中遮罩 - 当有组件被选中时显示 */}
			{curComponentId && (
				<SelectedMask portalWrapperClassName="portal-wrapper" containerClassName="edit-area" componentId={curComponentId} />
			)}
			{/* Portal容器 - 用于渲染遮罩层 */}
			<div className="portal-wrapper"></div>
		</div>
	);
}
