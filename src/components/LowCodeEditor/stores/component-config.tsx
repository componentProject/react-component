/**
 * 导入状态管理库
 */
import { create } from "zustand";
/**
 * 导入各组件的开发态和生产态版本
 */
import ContainerDev from "@/components/LowCodeEditor/materials/Container/dev";
import ContainerProd from "@/components/LowCodeEditor/materials/Container/prod";
import ButtonDev from "@/components/LowCodeEditor/materials/Button/dev";
import ButtonProd from "@/components/LowCodeEditor/materials/Button/prod";
import PageDev from "@/components/LowCodeEditor/materials/Page/dev";
import PageProd from "@/components/LowCodeEditor/materials/Page/prod";
import ModalProd from "@/components/LowCodeEditor/materials/Modal/prod";
import ModalDev from "@/components/LowCodeEditor/materials/Modal/dev";
import TableDev from "@/components/LowCodeEditor/materials/Table/dev";
import TableProd from "@/components/LowCodeEditor/materials/Table/prod";
import TableColumnDev from "@/components/LowCodeEditor/materials/TableColumn/dev";
import TableColumnProd from "@/components/LowCodeEditor/materials/TableColumn/prod";
import FormDev from "@/components/LowCodeEditor/materials/Form/dev";
import FormProd from "@/components/LowCodeEditor/materials/Form/prod";
import FormItemDev from "@/components/LowCodeEditor/materials/FormItem/dev";
import FormItemProd from "@/components/LowCodeEditor/materials/FormItem/prod";

/**
 * 组件属性配置器接口
 * @interface ComponentSetter
 */
export interface ComponentSetter {
	/** 配置项名称 */
	name: string;
	/** 配置项标签 */
	label: string;
	/** 配置项类型 */
	type: string;
	/** 其他任意属性 */
	[key: string]: any;
}

/**
 * 组件事件接口
 * @interface ComponentEvent
 */
export interface ComponentEvent {
	/** 事件名称 */
	name: string;
	/** 事件标签 */
	label: string;
}

/**
 * 组件方法接口
 * @interface ComponentMethod
 */
export interface ComponentMethod {
	/** 方法名称 */
	name: string;
	/** 方法标签 */
	label: string;
}

/**
 * 组件配置接口
 * @interface ComponentConfig
 */
export interface ComponentConfig {
	/** 组件名称 */
	name: string;
	/** 组件默认属性 */
	defaultProps: Record<string, any>;
	/** 组件描述 */
	desc: string;
	/** 组件属性配置器 */
	setter?: ComponentSetter[];
	/** 组件样式配置器 */
	stylesSetter?: ComponentSetter[];
	/** 组件事件 */
	events?: ComponentEvent[];
	/** 组件方法 */
	methods?: ComponentMethod[];
	/** 开发态组件 */
	dev: any;
	/** 生产态组件 */
	prod: any;
}

/**
 * 状态接口
 * @interface State
 */
interface State {
	/** 组件配置集合 */
	componentConfig: { [key: string]: ComponentConfig };
}

/**
 * 操作接口
 * @interface Action
 */
interface Action {
	/** 注册组件方法 */
	registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

/**
 * 组件配置存储Hook
 * 管理所有可用组件的配置信息
 */
export const useComponentConfigStore = create<State & Action>((set) => ({
	componentConfig: {
		Container: {
			name: "Container",
			defaultProps: {},
			desc: "容器",
			dev: ContainerDev,
			prod: ContainerProd,
		},
		Button: {
			name: "Button",
			defaultProps: {
				type: "primary",
				text: "按钮",
			},
			setter: [
				{
					name: "type",
					label: "按钮类型",
					type: "select",
					options: [
						{ label: "主按钮", value: "primary" },
						{ label: "次按钮", value: "default" },
					],
				},
				{
					name: "text",
					label: "文本",
					type: "input",
				},
			],
			stylesSetter: [
				{
					name: "width",
					label: "宽度",
					type: "inputNumber",
				},
				{
					name: "height",
					label: "高度",
					type: "inputNumber",
				},
			],
			events: [
				{
					name: "onClick",
					label: "点击事件",
				},
				{
					name: "onDoubleClick",
					label: "双击事件",
				},
			],
			desc: "按钮",
			dev: ButtonDev,
			prod: ButtonProd,
		},
		Modal: {
			name: "Modal",
			defaultProps: {
				title: "弹窗",
			},
			setter: [
				{
					name: "title",
					label: "标题",
					type: "input",
				},
			],
			stylesSetter: [],
			events: [
				{
					name: "onOk",
					label: "确认事件",
				},
				{
					name: "onCancel",
					label: "取消事件",
				},
			],
			methods: [
				{
					name: "open",
					label: "打开弹窗",
				},
				{
					name: "close",
					label: "关闭弹窗",
				},
			],
			desc: "弹窗",
			dev: ModalDev,
			prod: ModalProd,
		},
		Page: {
			name: "Page",
			defaultProps: {},
			desc: "页面",
			dev: PageDev,
			prod: PageProd,
		},
		Table: {
			name: "Table",
			defaultProps: {},
			desc: "表格",
			setter: [
				{
					name: "url",
					label: "url",
					type: "input",
				},
			],
			dev: TableDev,
			prod: TableProd,
		},
		TableColumn: {
			name: "TableColumn",
			desc: "表格列",
			defaultProps: {
				dataIndex: `col_${new Date().getTime()}`,
				title: "列名",
			},
			setter: [
				{
					name: "type",
					label: "类型",
					type: "select",
					options: [
						{
							label: "文本",
							value: "text",
						},
						{
							label: "日期",
							value: "date",
						},
					],
				},
				{
					name: "title",
					label: "标题",
					type: "input",
				},
				{
					name: "dataIndex",
					label: "字段",
					type: "input",
				},
			],
			dev: TableColumnDev,
			prod: TableColumnProd,
		},
		Form: {
			name: "Form",
			defaultProps: {},
			desc: "表单",
			setter: [
				{
					name: "title",
					label: "标题",
					type: "input",
				},
			],
			events: [
				{
					name: "onFinish",
					label: "提交事件",
				},
			],
			methods: [
				{
					name: "submit",
					label: "提交",
				},
			],
			dev: FormDev,
			prod: FormProd,
		},
		FormItem: {
			name: "FormItem",
			desc: "表单项",
			defaultProps: {
				name: new Date().getTime(),
				label: "姓名",
			},
			dev: FormItemDev,
			prod: FormItemProd,
			setter: [
				{
					name: "type",
					label: "类型",
					type: "select",
					options: [
						{
							label: "文本",
							value: "input",
						},
						{
							label: "日期",
							value: "date",
						},
					],
				},
				{
					name: "label",
					label: "标题",
					type: "input",
				},
				{
					name: "name",
					label: "字段",
					type: "input",
				},
				{
					name: "rules",
					label: "校验",
					type: "select",
					options: [
						{
							label: "必填",
							value: "required",
						},
					],
				},
			],
		},
	},
	/**
	 * 注册新组件到配置存储
	 *
	 * @param {string} name - 组件名称
	 * @param {ComponentConfig} componentConfig - 组件配置信息
	 */
	registerComponent: (name, componentConfig) =>
		set((state) => {
			return {
				...state,
				componentConfig: {
					...state.componentConfig,
					[name]: componentConfig,
				},
			};
		}),
}));
