/**
 * 导入React DnD拖拽功能
 */
import { useDrag } from "react-dnd";
/**
 * 导入自定义物料拖拽Hook
 */
import { useMaterailDrop } from "@/components/LowCodeEditor/hooks/useMaterailDrop";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";
/**
 * 导入React Hooks
 */
import { useEffect, useRef } from "react";

/**
 * 容器组件（开发态）
 *
 * 在编辑器中可拖拽的容器组件，可以放置其他组件
 * 支持被拖拽移动，也可以作为其他组件的放置目标
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 容器组件
 */
const Container = ({ id, name, children, styles }: CommonComponentProps) => {
	/**
	 * 配置拖拽放置功能
	 * 接受Button、Container、Table和Form类型的组件
	 */
	const { canDrop, drop } = useMaterailDrop(["Button", "Container", "Table", "Form"], id);

	/**
	 * 容器DOM引用
	 */
	const divRef = useRef<HTMLDivElement>(null);

	/**
	 * 配置拖拽功能
	 * 使容器可在编辑器中移动
	 */
	const [_, drag] = useDrag({
		type: name,
		item: {
			type: name,
			dragType: "move",
			id: id,
		},
	});

	/**
	 * 应用拖拽和放置功能到容器
	 */
	useEffect(() => {
		drop(divRef);
		drag(divRef);
	}, []);

	/**
	 * 渲染容器组件
	 */
	return (
		<div
			data-component-id={id}
			ref={divRef}
			style={styles}
			className={`min-h-[100px] p-[20px] ${canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"}`}
		>
			{children}
		</div>
	);
};

export default Container;
