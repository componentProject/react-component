/**
 * 导入React Hooks
 */
import { useEffect, useRef } from "react";
/**
 * 导入React DnD拖拽功能
 */
import { useDrag } from "react-dnd";

/**
 * 物料项属性接口
 * @interface MaterialItemProps
 */
export interface MaterialItemProps {
	/** 组件名称 */
	name: string;
	/** 组件描述 */
	desc: string;
}

/**
 * 物料项组件
 *
 * 显示单个组件物料，可被拖拽到编辑区
 * 使用React DnD库实现拖拽功能
 *
 * @param {MaterialItemProps} props - 物料项属性
 * @returns {JSX.Element} 物料项组件
 */
export function MaterialItem(props: MaterialItemProps) {
	/**
	 * 解构属性
	 */
	const { name, desc } = props;

	/**
	 * 配置拖拽功能
	 */
	const [_, drag] = useDrag({
		type: name,
		item: {
			type: name,
		},
	});

	/**
	 * 渲染物料项
	 */
	return (
		<div
			ref={drag}
			className="
            border-dashed
            border-[1px]
            border-[#000]
            py-[8px] px-[10px] 
            m-[10px]
            cursor-move
            inline-block
            bg-white
            hover:bg-[#ccc]
        "
		>
			{desc}
		</div>
	);
}
