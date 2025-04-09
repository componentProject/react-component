/**
 * @file IntlTable.tsx
 * @description 国际化资源管理表格组件
 */

/** 导入React相关依赖 */
import React, { useState, useEffect } from "react";
/** 导入antd组件 */
import { Table, Button, Upload, message, Form, Alert, Space } from "antd";
/** 导入antd图标 */
import { UploadOutlined, DownloadOutlined, SaveOutlined, SyncOutlined } from "@ant-design/icons";
/** 导入exceljs用于处理Excel文件 */
import { Workbook } from "exceljs";
/** 导入国际化相关工具函数 */
import {
	SupportedLocales,
	TranslationType,
	getMessages,
	getLocaleMessages,
	getSupportedLocales,
	saveLocaleFile,
	saveMessagesFile,
	clearCache,
	MessagesType,
} from "@/locales";
/** 导入可编辑单元格组件 */
import { EditableCell } from "./EditableCell";

/**
 * @interface IntlTableProps
 * @description 国际化表格组件的属性接口
 * @property {SupportedLocales[]} [languages] - 支持的语言列表，默认为 ['zh-CN', 'en-US']
 */
interface IntlTableProps {
	languages?: SupportedLocales[];
}

/**
 * @interface TableRowData
 * @description 表格行数据接口
 * @property {string} key - 行唯一标识
 * @property {string} id - 消息ID
 * @property {string} defaultMessage - 默认消息文本
 * @property {string} description - 消息描述
 * @property {string} [key: string] - 动态语言键值对
 */
interface TableRowData {
	key: string;
	id: string;
	defaultMessage: string;
	description: string;
	[key: string]: string;
}

/**
 * @component IntlTable
 * @description 这是一个国际化表格组件，功能是管理多语言资源，支持导入导出Excel，编辑和保存多语言内容,
 *
 * 依赖node服务才能同步修改本地src/locales下文件
 */
const IntlTable: React.FC<IntlTableProps> = (props) => {
	/** 使用Form.useForm创建表单实例 */
	const [form] = Form.useForm();

	/** 定义表格数据状态 */
	const [data, setData] = useState<TableRowData[]>([]);

	/** 定义加载状态 */
	const [loading, setLoading] = useState<boolean>(false);

	/** 定义消息定义数据状态 */
	const [messagesData, setMessagesData] = useState<MessagesType>({});

	/** 定义语言文件数据状态 */
	const [languageFiles, setLanguageFiles] = useState<Record<SupportedLocales, TranslationType>>(
		{} as Record<SupportedLocales, TranslationType>,
	);

	/** 定义当前编辑的行key状态 */
	const [editingKey, setEditingKey] = useState<string>("");

	/** 定义支持的语言列表状态 */
	const [languages, setLanguages] = useState<SupportedLocales[]>(props.languages || ["zh-CN", "en-US"]);

	/** 组件挂载时获取数据 */
	useEffect(() => {
		fetchData();
	}, []);

	/** 检查当前行是否处于编辑状态 */
	const isEditing = (record: TableRowData) => record.key === editingKey;

	/** 进入编辑状态 */
	const edit = (record: TableRowData) => {
		form.setFieldsValue({ ...record });
		setEditingKey(record.key);
	};

	/** 取消编辑状态 */
	const cancel = () => {
		setEditingKey("");
	};

	/** 保存编辑内容 */
	const save = async (key: string) => {
		try {
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key);

			if (index > -1) {
				const item = newData[index];
				const updatedItem = { ...item, ...row };
				newData.splice(index, 1, updatedItem);

				// 更新语言文件
				const updatedLangFiles = { ...languageFiles };
				languages.forEach((lang: SupportedLocales) => {
					if (updatedLangFiles[lang] && row[lang] !== undefined) {
						updatedLangFiles[lang][key] = row[lang];
					}
				});

				// 更新消息定义文件
				const updatedMessagesData = { ...messagesData };
				if (row.defaultMessage !== undefined || row.description !== undefined) {
					updatedMessagesData[key] = {
						defaultMessage: row.defaultMessage || messagesData[key]?.defaultMessage || "",
						description: row.description || messagesData[key]?.description || "",
					};
				}

				setData(newData);
				setLanguageFiles(updatedLangFiles);
				setMessagesData(updatedMessagesData);
				setEditingKey("");

				// 保存到服务器
				await saveAllFiles(updatedLangFiles, updatedMessagesData);
				message.success("更新成功");
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
			message.error("保存失败");
		}
	};

	/**
	 * @method fetchData
	 * @description 获取表格数据
	 */
	const fetchData = async () => {
		try {
			setLoading(true);

			// 获取支持的语言
			const supportedLocales = await getSupportedLocales();
			setLanguages(supportedLocales);

			// 获取消息定义
			const messages = await getMessages();
			setMessagesData(messages);

			// 获取各语言翻译
			const langFiles: Record<SupportedLocales, TranslationType> = {} as Record<SupportedLocales, TranslationType>;
			const translations = await Promise.all(
				supportedLocales.map(async (lang) => {
					const data = await getLocaleMessages(lang);
					return { lang, data };
				}),
			);

			translations.forEach(({ lang, data }) => {
				langFiles[lang] = data;
			});

			setLanguageFiles(langFiles);

			// 组装表格数据
			const tableData: TableRowData[] = [];
			Object.keys(messages).forEach((key) => {
				const rowData: TableRowData = {
					key,
					id: key,
					defaultMessage: messages[key].defaultMessage,
					description: messages[key].description,
				};

				supportedLocales.forEach((lang) => {
					rowData[lang] = langFiles[lang][key] || "";
				});

				tableData.push(rowData);
			});

			setData(tableData);
		} catch (error) {
			console.error("Failed to load data:", error);
			message.error("加载数据失败");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * @type {Array<ColumnType<TableRowData>>} columns - 表格列定义
	 */
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 200,
			editable: false,
			sorter: (a: TableRowData, b: TableRowData) => a.id.localeCompare(b.id),
		},
		{
			title: "默认文本",
			dataIndex: "defaultMessage",
			key: "defaultMessage",
			width: 200,
			editable: true,
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
			width: 300,
			editable: true,
		},
		...languages.map((lang: SupportedLocales) => ({
			title: lang,
			dataIndex: lang,
			key: lang,
			width: 200,
			editable: true,
		})),
		{
			title: "操作",
			dataIndex: "operation",
			width: 150,
			render: (_: any, record: TableRowData) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Button type="link" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
							保存
						</Button>
						<Button type="link" onClick={cancel}>
							取消
						</Button>
					</span>
				) : (
					<Button type="link" disabled={editingKey !== ""} onClick={() => edit(record)}>
						编辑
					</Button>
				);
			},
		},
	];

	/**
	 * @type {Array<ColumnType<TableRowData>>} mergedColumns - 合并后的表格列定义
	 */
	const mergedColumns = columns.map((col: any) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: TableRowData) => ({
				record,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	/**
	 * @method exportToExcel
	 * @description 导出数据到Excel文件
	 */
	const exportToExcel = async () => {
		try {
			setLoading(true);
			const workbook = new Workbook();
			const worksheet = workbook.addWorksheet("国际化数据");

			// 设置列标题
			worksheet.columns = [
				{ header: "ID", key: "id", width: 30 },
				{ header: "默认文本", key: "defaultMessage", width: 30 },
				{ header: "描述", key: "description", width: 50 },
				...languages.map((lang) => ({
					header: lang,
					key: lang,
					width: 30,
				})),
			];

			// 添加数据行
			worksheet.addRows(data);

			// 设置表头样式
			const headerRow = worksheet.getRow(1);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFE0E0E0" },
				};
			});

			// 生成Excel文件
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "国际化数据.xlsx";
			link.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("导出Excel失败:", error);
			message.error("导出Excel失败");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * @method importFromExcel
	 * @description 从Excel文件导入数据
	 * @param {File} file - Excel文件
	 */
	const importFromExcel = async (file: File) => {
		try {
			setLoading(true);
			const workbook = new Workbook();
			const arrayBuffer = await file.arrayBuffer();
			await workbook.xlsx.load(arrayBuffer);
			const worksheet = workbook.getWorksheet(1);

			if (!worksheet) {
				throw new Error("无法读取Excel文件");
			}

			// 获取列标题
			const headers = worksheet.getRow(1).values as string[];
			const idIndex = headers.indexOf("ID");
			const defaultMessageIndex = headers.indexOf("默认文本");
			const descriptionIndex = headers.indexOf("描述");
			const langIndices = languages.map((lang) => headers.indexOf(lang));

			if (idIndex === -1 || defaultMessageIndex === -1) {
				throw new Error("Excel文件格式不正确");
			}

			// 解析数据
			const newMessagesData: MessagesType = {};
			const newLangFiles: Record<SupportedLocales, TranslationType> = {} as Record<SupportedLocales, TranslationType>;
			languages.forEach((lang) => {
				newLangFiles[lang] = {};
			});

			worksheet.eachRow((row, rowNumber) => {
				if (rowNumber === 1) return; // 跳过表头

				const values = row.values as string[];
				const id = values[idIndex];
				const defaultMessage = values[defaultMessageIndex];
				const description = values[descriptionIndex];

				if (!id || !defaultMessage) return;

				// 更新消息定义
				newMessagesData[id] = {
					defaultMessage,
					description: description || "",
				};

				// 更新翻译
				languages.forEach((lang, index) => {
					const langIndex = langIndices[index];
					if (langIndex !== -1 && values[langIndex]) {
						newLangFiles[lang][id] = values[langIndex];
					}
				});
			});

			// 保存数据
			await saveAllFiles(newLangFiles, newMessagesData);
			message.success("导入成功");
			await fetchData();
		} catch (error) {
			console.error("导入Excel失败:", error);
			message.error("导入Excel失败");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * @method saveAllFiles
	 * @description 保存所有语言文件和消息定义文件
	 * @param {Record<SupportedLocales, TranslationType>} langFiles - 语言文件数据
	 * @param {MessagesType} messagesData - 消息定义数据
	 * @returns {Promise<boolean>} 保存是否成功
	 */
	const saveAllFiles = async (
		langFiles: Record<SupportedLocales, TranslationType>,
		messagesData: MessagesType,
	): Promise<boolean> => {
		try {
			setLoading(true);
			// 保存每个语言文件
			const savePromises = languages.map((lang: SupportedLocales) => saveLocaleFile(lang, langFiles[lang]));

			// 保存消息定义文件
			savePromises.push(saveMessagesFile(messagesData));

			// 等待所有保存完成
			const results = await Promise.all(savePromises);

			// 检查是否有保存失败的情况
			const success = results.every((result: boolean) => result === true);
			setLoading(false);
			return success;
		} catch (error) {
			console.error("Failed to save files:", error);
			message.error("保存文件失败");
			setLoading(false);
			return false;
		}
	};

	return (
		<div className="intl-table">
			<Alert
				message="国际化资源管理"
				description={
					<div>
						<p>通过此表格可以管理多语言翻译资源，支持编辑、导入、导出功能。</p>
						<p>修改会保存到对应的语言文件中，以便在应用中使用。</p>
					</div>
				}
				type="info"
				showIcon
				style={{ marginBottom: 16 }}
			/>

			<div className="intl-table-header" style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
				<Space>
					<Upload beforeUpload={importFromExcel} showUploadList={false} accept=".xlsx,.xls">
						<Button icon={<UploadOutlined />} loading={loading}>
							导入Excel
						</Button>
					</Upload>
					<Button icon={<DownloadOutlined />} onClick={exportToExcel} loading={loading}>
						导出Excel
					</Button>
					<Button
						icon={<SaveOutlined />}
						onClick={async () => {
							const success = await saveAllFiles(languageFiles, messagesData);
							if (success) {
								message.success("已保存所有更改到源代码文件");
							}
						}}
						disabled={loading}
					>
						保存更改
					</Button>
					<Button
						icon={<SyncOutlined />}
						onClick={() => {
							clearCache();
							fetchData();
							message.success("已重新从源文件加载数据");
						}}
						type="primary"
					>
						刷新数据
					</Button>
				</Space>
			</div>

			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					columns={mergedColumns}
					dataSource={data}
					loading={loading}
					scroll={{ x: "max-content" }}
					pagination={{ pageSize: 10 }}
					bordered
					rowClassName="editable-row"
				/>
			</Form>
		</div>
	);
};

export default IntlTable;
