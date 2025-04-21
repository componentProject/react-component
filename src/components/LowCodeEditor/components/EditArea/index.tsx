/**
 * 导入React相关依赖
 */
import React, { MouseEventHandler, useEffect, useState } from "react";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "../../stores/component-config";
/**
 * 导入组件状态存储和类型
 */
import { Component, useComponetsStore } from "../../stores/components";
/**
 * 导入悬停遮罩组件
 */
import HoverMask from "../HoverMask";
/**
 * 导入选中遮罩组件
 */
import SelectedMask from "../SelectedMask";

/**
 * 编辑区域组件
 *
 * 用法: <EditArea />
 *
 * 负责渲染低代码编辑器的主要编辑区，处理组件的展示、悬停和选中状态
 */
export function EditArea() {
	/**
	 * 从组件状态存储中获取组件列表、当前选中组件ID及设置函数
	 */
	const { components, curComponentId, setCurComponentId } = useComponetsStore();
	/**
	 * 从组件配置存储中获取组件配置
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 递归渲染组件树
	 * @param components 要渲染的组件数组
	 * @returns 渲染后的React节点
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
	 * 当前鼠标悬停的组件ID
	 */
	const [hoverComponentId, setHoverComponentId] = useState<number>();

	/**
	 * 处理鼠标悬停事件
	 * 通过事件路径查找带有componentId数据属性的元素
	 * @param e 鼠标事件对象
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
	 * 通过事件路径查找带有componentId数据属性的元素并设置为当前选中组件
	 * @param e 鼠标事件对象
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
	 * 渲染编辑区域，包括组件树和遮罩层
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
			{/* 当有组件悬停且不是当前选中组件时显示悬停遮罩 */}
			{hoverComponentId && hoverComponentId !== curComponentId && (
				<HoverMask portalWrapperClassName="portal-wrapper" containerClassName="edit-area" componentId={hoverComponentId} />
			)}
			{/* 当有选中组件时显示选中遮罩 */}
			{curComponentId && (
				<SelectedMask portalWrapperClassName="portal-wrapper" containerClassName="edit-area" componentId={curComponentId} />
			)}
			{/* Portal容器，用于渲染遮罩层 */}
			<div className="portal-wrapper"></div>
		</div>
	);
}
