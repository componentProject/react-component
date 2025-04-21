/**
 * 导入React类型定义
 */
import { CSSProperties } from "react";
/**
 * 导入状态管理库
 */
import { create, StateCreator } from "zustand";
/**
 * 导入持久化中间件
 */
import { persist } from "zustand/middleware";

/**
 * 组件数据结构接口
 * @interface Component
 */
export interface Component {
	/** 组件唯一标识 */
	id: number;
	/** 组件类型名称 */
	name: string;
	/** 组件属性 */
	props: any;
	/** 组件样式 */
	styles?: CSSProperties;
	/** 组件描述 */
	desc: string;
	/** 子组件列表 */
	children?: Component[];
	/** 父组件ID */
	parentId?: number;
}

/**
 * 组件状态接口
 * @interface State
 */
interface State {
	/** 组件树 */
	components: Component[];
	/** 编辑器模式 */
	mode: "edit" | "preview";
	/** 当前选中的组件ID */
	curComponentId?: number | null;
	/** 当前选中的组件 */
	curComponent: Component | null;
}

/**
 * 组件操作接口
 * @interface Action
 */
interface Action {
	/** 添加组件方法 */
	addComponent: (component: Component, parentId?: number) => void;
	/** 删除组件方法 */
	deleteComponent: (componentId: number) => void;
	/** 更新组件属性方法 */
	updateComponentProps: (componentId: number, props: any) => void;
	/** 更新组件样式方法 */
	updateComponentStyles: (componentId: number, styles: CSSProperties, replace?: boolean) => void;
	/** 设置当前选中组件ID方法 */
	setCurComponentId: (componentId: number | null) => void;
	/** 设置编辑器模式方法 */
	setMode: (mode: State["mode"]) => void;
}

/**
 * 状态创建器
 * 定义组件树的初始状态和操作方法
 */
const creator: StateCreator<State & Action> = (set, get) => ({
	components: [
		{
			id: 1,
			name: "Page",
			props: {},
			desc: "页面",
		},
	],
	curComponentId: null,
	curComponent: null,
	mode: "edit",
	/**
	 * 设置编辑器模式
	 * @param {State['mode']} mode - 编辑器模式
	 */
	setMode: (mode) => set({ mode }),
	/**
	 * 设置当前选中的组件ID
	 * @param {number | null} componentId - 组件ID
	 */
	setCurComponentId: (componentId) =>
		set((state) => ({
			curComponentId: componentId,
			curComponent: getComponentById(componentId, state.components),
		})),
	/**
	 * 添加组件到组件树
	 * @param {Component} component - 要添加的组件
	 * @param {number} [parentId] - 父组件ID
	 */
	addComponent: (component, parentId) =>
		set((state) => {
			if (parentId) {
				const parentComponent = getComponentById(parentId, state.components);

				if (parentComponent) {
					if (parentComponent.children) {
						parentComponent.children.push(component);
					} else {
						parentComponent.children = [component];
					}
				}

				component.parentId = parentId;
				return { components: [...state.components] };
			}
			return { components: [...state.components, component] };
		}),
	/**
	 * 从组件树中删除组件
	 * @param {number} componentId - 要删除的组件ID
	 */
	deleteComponent: (componentId) => {
		if (!componentId) return;

		const component = getComponentById(componentId, get().components);
		if (component?.parentId) {
			const parentComponent = getComponentById(component.parentId, get().components);

			if (parentComponent) {
				parentComponent.children = parentComponent?.children?.filter((item) => item.id !== +componentId);

				set({ components: [...get().components] });
			}
		}
	},
	/**
	 * 更新组件属性
	 * @param {number} componentId - 组件ID
	 * @param {any} props - 要更新的属性对象
	 */
	updateComponentProps: (componentId, props) =>
		set((state) => {
			const component = getComponentById(componentId, state.components);
			if (component) {
				component.props = { ...component.props, ...props };

				return { components: [...state.components] };
			}

			return { components: [...state.components] };
		}),
	/**
	 * 更新组件样式
	 * @param {number} componentId - 组件ID
	 * @param {CSSProperties} styles - 要更新的样式对象
	 * @param {boolean} [replace] - 是否替换现有样式
	 */
	updateComponentStyles: (componentId, styles, replace) =>
		set((state) => {
			const component = getComponentById(componentId, state.components);
			if (component) {
				component.styles = replace ? { ...styles } : { ...component.styles, ...styles };

				return { components: [...state.components] };
			}

			return { components: [...state.components] };
		}),
});

/**
 * 组件状态存储Hook
 * 提供组件树的状态和操作方法
 */
export const useComponetsStore = create<State & Action>()(
	persist(creator, {
		name: "xxx",
	}),
);

/**
 * 根据ID查找组件
 * 递归查找组件树中的组件
 *
 * @param {number | null} id - 要查找的组件ID
 * @param {Component[]} components - 组件树
 * @returns {Component | null} 找到的组件或null
 */
export function getComponentById(id: number | null, components: Component[]): Component | null {
	if (!id) return null;

	for (const component of components) {
		if (component.id == id) return component;
		if (component.children && component.children.length > 0) {
			const result = getComponentById(id, component.children);
			if (result !== null) return result;
		}
	}
	return null;
}
