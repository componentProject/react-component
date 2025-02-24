import type { placementType as TooltipPlacement } from "@/components/Popover";
import React from "react";

export interface OnBoardingStepConfig {
	selector: () => HTMLElement | null;

	placement?: TooltipPlacement;

	renderContent?: (currentStep: number) => React.ReactNode;

	beforeForward?: (currentStep: number) => Promise<void> | void;

	beforeBack?: (currentStep: number) => Promise<void> | void;
}

export interface propsType {
	step?: number;

	steps: OnBoardingStepConfig[];

	getContainer?: () => HTMLElement;

	onStepsEnd?: () => Promise<void> | void;
}
