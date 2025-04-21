/**
 * 导入React和钩子
 */
import React, { useRef } from "react";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "../../stores/component-config";
/**
 * 导入组件状态存储和类型
 */
import { Component, useComponetsStore } from "../../stores/components";
/**
 * 导入Ant Design消息组件
 */
import { message } from "antd";
/**
 * 导入动作配置类型
 */
import { ActionConfig } from "../Setting/ActionModal";

/**
 * 预览组件
 *
 * 用法: <Preview />
 *
 * 渲染当前页面的实际预览效果，处理组件之间的交互和事件
 *
 * @returns {JSX.Element} 渲染的预览内容
 */
export function Preview() {
	/**
	 * 从组件状态存储中获取组件列表
	 */
	const { components } = useComponetsStore();
	/**
	 * 从组件配置存储中获取组件配置
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 组件引用存储，用于组件间方法调用
	 */
	const componentRefs = useRef<Record<string, any>>({});

	/**
	 * 处理组件事件
	 * 配置组件的事件处理函数，执行相应的动作
	 *
	 * @param {Component} component 当前组件
	 * @returns {Record<string, any>} 组件的事件处理属性
	 */
	function handleEvent(component: Component) {
		const props: Record<string, any> = {};

		componentConfig[component.name].events?.forEach((event) => {
			const eventConfig = component.props[event.name];

			if (eventConfig) {
				props[event.name] = (...args: any[]) => {
					eventConfig?.actions?.forEach((action: ActionConfig) => {
						if (action.type === "goToLink") {
							window.location.href = action.url;
						} else if (action.type === "showMessage") {
							if (action.config.type === "success") {
								message.success(action.config.text);
							} else if (action.config.type === "error") {
								message.error(action.config.text);
							}
						} else if (action.type === "customJS") {
							const func = new Function("context", "args", action.code);
							func(
								{
									name: component.name,
									props: component.props,
									showMessage(content: string) {
										message.success(content);
									},
								},
								args,
							);
						} else if (action.type === "componentMethod") {
							const component = componentRefs.current[action.config.componentId];

							if (component) {
								component[action.config.method]?.(...args);
							}
						}
					});
				};
			}
		});
		return props;
	}

	/**
	 * 递归渲染组件树
	 * 为每个组件应用配置、属性和事件处理
	 *
	 * @param {Component[]} components 要渲染的组件数组
	 * @returns {React.ReactNode} 渲染后的React节点
	 */
	function renderComponents(components: Component[]): React.ReactNode {
		return components.map((component: Component) => {
			const config = componentConfig?.[component.name];

			if (!config?.prod) {
				return null;
			}

			return React.createElement(
				config.prod,
				{
					key: component.id,
					id: component.id,
					name: component.name,
					styles: component.styles,
					ref: (ref: Record<string, any>) => {
						componentRefs.current[component.id] = ref;
					},
					...config.defaultProps,
					...component.props,
					...handleEvent(component),
				},
				renderComponents(component.children || []),
			);
		});
	}

	/**
	 * 渲染预览内容
	 */
	return <div>{renderComponents(components)}</div>;
}
