/**
 * 导入Ant Design表格组件
 */
import { Table as AntdTable } from "antd";
/**
 * 导入React相关依赖
 */
import React, { useEffect, useMemo, useRef } from "react";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";
/**
 * 导入自定义物料拖拽Hook
 */
import { useMaterailDrop } from "@/components/LowCodeEditor/hooks/useMaterailDrop";
/**
 * 导入React DnD拖拽功能
 */
import { useDrag } from "react-dnd";

/**
 * 表格组件（开发态）
 *
 * 在编辑器中可拖拽的表格组件，可以接受TableColumn作为子组件
 * 支持被拖拽移动，也可以作为表格列的放置目标
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 表格组件
 */
function Table({ id, name, children, styles }: CommonComponentProps) {
	/**
	 * 配置拖拽放置功能
	 * 只接受TableColumn类型的组件
	 */
	const { canDrop, drop } = useMaterailDrop(["TableColumn"], id);

	/**
	 * 表格DOM引用
	 */
	const divRef = useRef<HTMLDivElement>(null);

	/**
	 * 配置拖拽功能
	 * 使表格可在编辑器中移动
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
	 * 应用拖拽和放置功能到表格
	 */
	useEffect(() => {
		drop(divRef);
		drag(divRef);
	}, []);

	/**
	 * 生成表格列配置
	 * 根据子组件生成表格所需的columns配置
	 */
	const columns = useMemo(() => {
		return React.Children.map(children, (item: any) => {
			return {
				title: (
					<div className="m-[-16px] p-[16px]" data-component-id={item.props?.id}>
						{item.props?.title}
					</div>
				),
				dataIndex: item.props?.dataIndex,
				key: item,
			};
		});
	}, [children]);

	/**
	 * 渲染表格组件
	 */
	return (
		<div
			className={`w-[100%] ${canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"}`}
			ref={divRef}
			data-component-id={id}
			style={styles}
		>
			{/* 表格内容 */}
			<AntdTable columns={columns} dataSource={[]} pagination={false} />
		</div>
	);
}

export default Table;
