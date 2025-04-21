/**
 * 导入React相关依赖
 */
import React, { useRef } from "react";
/**
 * 导入组件配置存储
 */
import { useComponentConfigStore } from "@/components/LowCodeEditor/stores/component-config";
/**
 * 导入组件状态存储
 */
import { Component, useComponetsStore } from "@/components/LowCodeEditor/stores/components";
/**
 * 导入Ant Design消息组件
 */
import { message } from "antd";
/**
 * 导入动作配置类型
 */
import { ActionConfig } from "@/components/LowCodeEditor/components/Setting/ActionModal";

/**
 * 预览组件
 *
 * 负责在预览模式下渲染组件树，处理组件的事件和动作
 * 通过引用保存组件实例，以便执行组件方法
 *
 * @returns {JSX.Element} 预览视图
 */
export function Preview() {
	/**
	 * 获取组件树
	 */
	const { components } = useComponetsStore();
	/**
	 * 获取组件配置
	 */
	const { componentConfig } = useComponentConfigStore();

	/**
	 * 存储组件实例的引用
	 */
	const componentRefs = useRef<Record<string, any>>({});

	/**
	 * 处理组件事件
	 * 根据组件配置的事件和动作，创建事件处理函数
	 *
	 * @param {Component} component - 要处理事件的组件
	 * @returns {Record<string, Function>} 事件处理函数集合
	 */
	function handleEvent(component: Component) {
		const props: Record<string, any> = {};

		componentConfig[component.name].events?.forEach((event) => {
			const eventConfig = component.props[event.name];

			if (eventConfig) {
				props[event.name] = (...args: any[]) => {
					eventConfig?.actions?.forEach((action: ActionConfig) => {
						if (action.type === "goToLink") {
							// 跳转链接动作
							window.location.href = action.url;
						} else if (action.type === "showMessage") {
							// 显示消息动作
							if (action.config.type === "success") {
								message.success(action.config.text);
							} else if (action.config.type === "error") {
								message.error(action.config.text);
							}
						} else if (action.type === "customJS") {
							// 自定义JS代码动作
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
							// 调用组件方法动作
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
	 * 使用组件的生产态版本进行渲染
	 *
	 * @param {Component[]} components - 要渲染的组件数组
	 * @returns {React.ReactNode} 渲染的组件树
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
	 * 渲染预览视图
	 */
	return (
		<div>
			{/* 渲染组件树 */}
			{renderComponents(components)}
		</div>
	);
}
