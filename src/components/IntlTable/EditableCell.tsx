/**
 * @file EditableCell.tsx
 * @description 可编辑表格单元格组件
 */

import React from "react";
import { Form, Input } from "antd";

/**
 * @interface EditableCellProps
 * @description 可编辑单元格组件的属性接口
 * @extends React.HTMLAttributes<HTMLElement>
 * @property {boolean} editing - 是否处于编辑状态
 * @property {string} dataIndex - 数据字段名
 * @property {string} title - 列标题
 * @property {any} record - 行数据记录
 * @property {number} index - 行索引
 * @property {React.ReactNode} children - 子节点
 */
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: string;
	record: any;
	index: number;
	children: React.ReactNode;
}

/**
 * @component EditableCell
 * @description 可编辑表格单元格组件
 * @param {EditableCellProps} props - 组件属性
 * @returns {React.FC} 返回可编辑单元格组件
 */
export const EditableCell: React.FC<EditableCellProps> = ({
	editing,
	dataIndex,
	title,
	record,
	index,
	children,
	...restProps
}) => {
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
					rules={[
						{
							required: dataIndex === "id",
							message: `请输入 ${title}!`,
						},
					]}
				>
					<Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} />
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};
