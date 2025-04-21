/**
 * 导入Ant Design表格组件
 */
import { Table as AntdTable } from "antd";
/**
 * 导入日期处理库
 */
import dayjs from "dayjs";
/**
 * 导入React相关依赖
 */
import React, { useEffect, useMemo, useState } from "react";
/**
 * 导入HTTP请求库
 */
import axios from "axios";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";

/**
 * 表格组件（生产态）
 *
 * 用于预览模式下的表格组件，支持从URL加载数据
 * 支持自定义列配置，包括日期格式化等特殊处理
 *
 * @param {CommonComponentProps} props - 组件属性
 * @returns {JSX.Element} 表格组件
 */
const Table = ({ url, children }: CommonComponentProps) => {
	/**
	 * 表格数据状态
	 */
	const [data, setData] = useState<Array<Record<string, any>>>([]);
	/**
	 * 加载状态
	 */
	const [loading, setLoading] = useState(false);

	/**
	 * 从URL获取表格数据
	 * 使用axios发送GET请求获取数据并更新状态
	 */
	const getData = async () => {
		if (url) {
			setLoading(true);

			const { data } = await axios.get(url);
			setData(data);

			setLoading(false);
		}
	};

	/**
	 * 组件挂载时加载数据
	 */
	useEffect(() => {
		getData();
	}, []);

	/**
	 * 生成表格列配置
	 * 根据子组件生成表格所需的columns配置
	 * 支持不同类型的处理，如日期格式化
	 */
	const columns = useMemo(() => {
		return React.Children.map(children, (item: any) => {
			if (item?.props?.type === "date") {
				return {
					title: item.props?.title,
					dataIndex: item.props?.dataIndex,
					render: (value: any) => (value ? dayjs(value).format("YYYY-MM-DD") : null),
				};
			} else {
				return {
					title: item.props?.title,
					dataIndex: item.props?.dataIndex,
				};
			}
		});
	}, [children]);

	/**
	 * 渲染表格组件
	 */
	return <AntdTable columns={columns} dataSource={data} pagination={false} rowKey="id" loading={loading} />;
};

export default Table;
