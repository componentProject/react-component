/**
 * 导入React钩子
 */
import { useEffect, useRef } from "react";
/**
 * 导入React DnD拖拽功能
 */
import { useDrag } from "react-dnd";

/**
 * 物料项组件的属性接口
 * @interface MaterialItemProps
 */
export interface MaterialItemProps {
	/** 组件名称，用于标识组件类型 */
	name: string;
	/** 组件描述，用于显示给用户 */
	desc: string;
}

/**
 * 物料项组件
 *
 * 用法: <MaterialItem name="Button" desc="按钮" />
 *
 * 显示一个可拖拽的物料项，用户可以将其拖拽到编辑区
 *
 * @param {MaterialItemProps} props 组件属性
 * @returns {JSX.Element} 渲染的物料项
 */
export function MaterialItem(props: MaterialItemProps) {
	/**
	 * 解构属性
	 */
	const { name, desc } = props;

	/**
	 * 配置拖拽功能
	 * 设置拖拽类型为组件名称，传递组件类型信息
	 */
	const [_, drag] = useDrag({
		type: name,
		item: {
			type: name,
		},
	});

	/**
	 * 渲染可拖拽的物料项
	 * 应用拖拽引用和样式
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
