/**
 * @file OnBoarding/index.tsx
 * @description 这是一个新手引导组件，功能是引导用户完成一系列操作步骤
 */

import React, { useEffect, useState } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { Button } from "antd";
import type { propsType } from "./types";
import Popover from "@/components/Popover";
import { Mask } from "./Mask";

/** OnBoarding 组件 */
export const OnBoarding: FC<propsType> = (props) => {
	/** 解构 props */
	const { step = 0, steps, onStepsEnd, getContainer } = props;

	/** 当前步骤状态 */
	const [currentStep, setCurrentStep] = useState<number>(0);

	/** 当前选中元素 */
	const currentSelectedElement = steps[currentStep]?.selector();

	/** 当前容器元素 */
	const currentContainerElement = getContainer?.() || document.documentElement;

	/** 完成状态 */
	const [done, setDone] = useState(false);

	/** 遮罩动画移动状态 */
	const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false);

	/** 获取当前步骤配置 */
	const getCurrentStep = () => {
		return steps[currentStep];
	};

	/** 返回上一步 */
	const back = async () => {
		if (currentStep === 0) {
			return;
		}

		const { beforeBack } = getCurrentStep();
		await beforeBack?.(currentStep);
		setCurrentStep(currentStep - 1);
	};

	/** 前进到下一步 */
	const forward = async () => {
		if (currentStep === steps.length - 1) {
			await onStepsEnd?.();
			setDone(true);
			return;
		}

		const { beforeForward } = getCurrentStep();
		await beforeForward?.(currentStep);
		setCurrentStep(currentStep + 1);
	};

	/** 监听 step 变化 */
	useEffect(() => {
		setCurrentStep(step!);
	}, [step]);

	/** 渲染 Popover */
	const renderPopover = (wrapper: React.ReactNode) => {
		const config = getCurrentStep();

		if (!config) {
			return wrapper;
		}

		const { renderContent } = config;
		const content = renderContent ? renderContent(currentStep) : null;

		/** 操作按钮 */
		const operation = (
			<div className={"onboarding-operation"}>
				{currentStep !== 0 && (
					<Button className={"back"} onClick={() => back()}>
						{"上一步"}
					</Button>
				)}
				<Button className={"forward"} type={"primary"} onClick={() => forward()}>
					{currentStep === steps.length - 1 ? "我知道了" : "下一步"}
				</Button>
			</div>
		);

		return isMaskMoving ? (
			wrapper
		) : (
			<Popover
				content={
					<div>
						{content}
						{operation}
					</div>
				}
				open={true}
				placement={getCurrentStep()?.placement}
			>
				{wrapper}
			</Popover>
		);
	};

	/** 用于触发更新 */
	const [, setRenderTick] = useState<number>(0);

	/** 初始化渲染时更新 */
	useEffect(() => {
		setRenderTick(1);
	}, []);

	/** 当前选中元素不存在或已完成，返回 null */
	if (!currentSelectedElement || done) {
		return null;
	}

	/** 渲染 Mask 组件 */
	const mask = (
		<Mask
			onAnimationStart={() => {
				setIsMaskMoving(true);
			}}
			onAnimationEnd={() => {
				setIsMaskMoving(false);
			}}
			container={currentContainerElement}
			element={currentSelectedElement}
			renderMaskContent={(wrapper) => renderPopover(wrapper)}
		/>
	);

	/** 使用 createPortal 将 Mask 组件渲染到指定容器 */
	return createPortal(mask, currentContainerElement);
};
