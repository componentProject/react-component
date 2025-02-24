type Alignment = "start" | "end";
type Side = "top" | "right" | "bottom" | "left";
type AlignedPlacement = `${Side}-${Alignment}`;
export type placementType = Side | AlignedPlacement;

export interface propsType extends PropsWithChildren {
	content?: ReactNode;
	trigger?: "hover" | "click";
	placement?: placementType;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
	style?: CSSProperties;
}
