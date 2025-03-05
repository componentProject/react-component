import type { placementType as TooltipPlacement } from "@/components/Popover/types";
import type { ReactNode } from "react";

/**
 * OnBoardingStepConfig 接口
 * 用于定义单个引导步骤的配置
 */
export interface OnBoardingStepConfig {
	/**
	 * selector 函数
	 * 返回当前步骤的目标 HTML 元素
	 */
	selector: () => HTMLElement | null;

	/**
	 * placement 属性
	 * 用于指定提示位置，类型为 TooltipPlacement
	 */
	placement?: TooltipPlacement;

	/**
	 * renderContent 函数
	 * 根据当前步骤返回要渲染的内容
	 */
	renderContent?: (currentStep: number) => ReactNode;

	/**
	 * beforeForward 函数
	 * 在进入下一步前执行的回调函数
	 */
	beforeForward?: (currentStep: number) => Promise<void> | void;

	/**
	 * beforeBack 函数
	 * 在返回上一步前执行的回调函数
	 */
	beforeBack?: (currentStep: number) => Promise<void> | void;
}

/**
 * propsType 接口
 * 定义 OnBoarding 组件的属性类型
 */
export interface propsType {
	/**
	 * step 属性
	 * 当前步骤序号，默认为 0
	 */
	step?: number;

	/**
	 * steps 属性
	 * 引导步骤配置数组
	 */
	steps: OnBoardingStepConfig[];

	/**
	 * getContainer 函数
	 * 返回用于渲染引导的容器元素
	 */
	getContainer?: () => HTMLElement;

	/**
	 * onStepsEnd 函数
	 * 所有步骤完成后的回调函数
	 */
	onStepsEnd?: () => Promise<void> | void;
}
