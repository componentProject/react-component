/**
 * @file IntlTable.tsx
 * @description 国际化资源管理表格组件
 */

/** 导入React相关依赖 */
import React, { useState, useEffect } from "react";
/** 导入antd组件 */
import { Table, Button, Upload, message, Form, Alert, Space, Modal, Dropdown, Menu, Tooltip, Select } from "antd";
/** 导入antd图标 */
import { UploadOutlined, DownloadOutlined, SaveOutlined, SyncOutlined, TranslationOutlined } from "@ant-design/icons";
/** 导入exceljs用于处理Excel文件 */
import { Workbook } from "exceljs";
/** 导入国际化相关工具函数 */
import {
	SupportedLocales,
	TranslationType,
	getMessages,
	getLocaleMessages,
	getSupportedLocales,
	batchSaveFiles,
	clearCache,
	MessagesType,
} from "@/locales";
/** 导入可编辑单元格组件 */
import { EditableCell } from "./EditableCell";

import Api from "@/api";

/**
 * @interface IntlTableProps
 * @description 国际化表格组件的属性接口
 * @property {SupportedLocales[]} [languages] - 支持的语言列表，默认为 ['zh-CN', 'en-US']
 */
interface IntlTableProps {
	/**
	 * 支持的语言列表
	 */
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
 * 翻译API类型
 */
enum TranslationApiType {
	BAIDU = "baidu",
	LOCAL = "local",
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

	/** 定义翻译加载状态 */
	const [translating, setTranslating] = useState<boolean>(false);
	/** 定义翻译API类型 */
	const [translationApiType, setTranslationApiType] = useState<TranslationApiType>(TranslationApiType.BAIDU);

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
	 * @method translateText
	 * @description 调用翻译API翻译文本
	 * @param {string} text - 要翻译的文本
	 * @param {string} fromLang - 源语言
	 * @param {string} toLang - 目标语言
	 * @returns {Promise<string>} - 翻译后的文本
	 */
	const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
		// 使用本地翻译
		console.log("translationApiType === TranslationApiType.LOCAL", translationApiType === TranslationApiType.LOCAL);
		if (translationApiType === TranslationApiType.LOCAL) {
			return mockTranslateText(text, fromLang, toLang);
		}

		// 使用百度翻译API
		try {
			const from = fromLang.slice(0, 2);
			const to = toLang.slice(0, 2);
			const data = await Api.translateApi.translate({
				q: text,
				from,
				to,
			});

			console.log("data", data);
			// 如果返回了错误码
			if (data.error_code) {
				console.error(`百度翻译API错误: ${data.error_code} - ${data.error_msg}`);
				throw new Error(`翻译失败: ${data.error_msg}`);
			} else {
				console.log("百度翻译API返回:", data);
				// 根据百度API返回格式提取翻译结果
				if (data && data.trans_result && data.trans_result.length > 0) {
					return data.trans_result[0].dst;
				}
			}
		} catch (error: any) {
			console.error("翻译API调用失败:", error);
			message.error(`翻译API调用失败: ${error.message || "未知错误"}`);
			return Promise.reject(error);
			// 出错时使用模拟翻译
			// return mockTranslateText(text, fromLang, toLang);
		}
	};

	// 添加一个示例用的轻量级翻译函数，不依赖外部API
	const mockTranslateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
		// 模拟翻译延迟
		await new Promise((resolve) => setTimeout(resolve, 300));

		// 简单的中英文互译示例
		if (fromLang.includes("zh") && toLang.includes("en")) {
			// 中文 -> 英文的简单映射
			const zhToEn: Record<string, string> = {
				你好: "Hello",
				世界: "World",
				按钮: "Button",
				取消: "Cancel",
				确认: "Confirm",
				提交: "Submit",
				保存: "Save",
				删除: "Delete",
				编辑: "Edit",
				查询: "Query",
				搜索: "Search",
				用户: "User",
				密码: "Password",
				登录: "Login",
				注册: "Register",
			};

			// 检查是否有完全匹配
			if (zhToEn[text]) {
				return zhToEn[text];
			}

			// 尝试部分匹配并替换
			let result = text;
			Object.keys(zhToEn).forEach((zh) => {
				if (text.includes(zh)) {
					result = result.replace(new RegExp(zh, "g"), zhToEn[zh]);
				}
			});

			if (result !== text) {
				return result;
			}

			// 没有匹配，返回模拟翻译
			return `${text} (Translated to English)`;
		}

		if (fromLang.includes("en") && toLang.includes("zh")) {
			// 英文 -> 中文的简单映射
			const enToZh: Record<string, string> = {
				Hello: "你好",
				World: "世界",
				Button: "按钮",
				Cancel: "取消",
				Confirm: "确认",
				Submit: "提交",
				Save: "保存",
				Delete: "删除",
				Edit: "编辑",
				Query: "查询",
				Search: "搜索",
				User: "用户",
				Password: "密码",
				Login: "登录",
				Register: "注册",
			};

			// 检查是否有完全匹配（忽略大小写）
			const lowerText = text.toLowerCase();
			for (const en in enToZh) {
				if (lowerText === en.toLowerCase()) {
					return enToZh[en];
				}
			}

			// 尝试部分匹配并替换
			let result = text;
			Object.keys(enToZh).forEach((en) => {
				const regex = new RegExp(en, "gi");
				if (regex.test(text)) {
					result = result.replace(regex, enToZh[en]);
				}
			});

			if (result !== text) {
				return result;
			}

			// 没有匹配，返回模拟翻译
			return `${text} (翻译成中文)`;
		}

		// 其他语言对返回模拟翻译
		return `${text} (${toLang})`;
	};

	/**
	 * @method translateColumn
	 * @description 翻译整列数据
	 * @param {SupportedLocales} fromLang - 源语言
	 * @param {SupportedLocales} toLang - 目标语言
	 */
	const translateColumn = async (fromLang: SupportedLocales, toLang: SupportedLocales) => {
		Modal.confirm({
			title: "翻译确认",
			content: (
				<>
					<p>
						确定要将 {fromLang} 列翻译成 {toLang} 吗？这将覆盖 {toLang} 列的现有空白内容。
					</p>
					<div style={{ marginTop: 10 }}>
						<Form.Item label="选择翻译API" style={{ marginBottom: 0 }}>
							<Select
								value={translationApiType}
								onChange={(value) => setTranslationApiType(value)}
								style={{ width: 200 }}
								options={[
									{ value: TranslationApiType.BAIDU, label: "百度翻译API" },
									{ value: TranslationApiType.LOCAL, label: "本地翻译库" },
								]}
							/>
							{translationApiType === TranslationApiType.BAIDU ? (
								<div style={{ fontSize: "12px", marginTop: 5 }}>使用百度翻译API（需要配置有效的API密钥）</div>
							) : (
								<div style={{ fontSize: "12px", marginTop: 5 }}>使用内置的本地翻译库（仅支持有限的词汇）</div>
							)}
						</Form.Item>
					</div>
				</>
			),
			onOk: async () => {
				try {
					setTranslating(true);

					const newData = [...data];
					const updatedLangFiles = { ...languageFiles };

					// 翻译空白内容
					for (let i = 0; i < newData.length; i++) {
						const row = newData[i];
						console.log("newData", row[fromLang], row[toLang]);
						if (row[fromLang]) {
							// if (!row[toLang] || row[toLang] === "") {
							//
							// }
							// 调用翻译API
							const translatedText = await translateText(row[fromLang], fromLang, toLang);
							if (translatedText) {
								row[toLang] = translatedText;
							}

							// 更新语言文件
							if (updatedLangFiles[toLang]) {
								updatedLangFiles[toLang][row.key] = translatedText;
							}
						}
					}

					// 更新状态
					setData(newData);
					setLanguageFiles(updatedLangFiles);

					// 提示用户保存更改
					Modal.confirm({
						title: "翻译完成",
						content: "是否立即保存更改到服务器？",
						onOk: async () => {
							const success = await saveAllFiles(updatedLangFiles, messagesData);
							if (success) {
								message.success(`已将翻译保存到服务器`);
							}
						},
						okText: "保存",
						cancelText: "稍后保存",
					});

					message.success(`已将 ${fromLang} 列翻译成 ${toLang}`);
				} catch (error) {
					console.error("翻译失败:", error);
					message.error("翻译失败");
				} finally {
					setTranslating(false);
				}
			},
		});
	};

	/**
	 * @method translateRow
	 * @description 翻译单行数据
	 * @param {string} key - 行 ID
	 * @param {SupportedLocales} fromLang - 源语言
	 * @param {SupportedLocales} toLang - 目标语言
	 */
	const translateRow = async (key: string, fromLang: SupportedLocales, toLang: SupportedLocales) => {
		Modal.confirm({
			title: "翻译确认",
			content: (
				<>
					<p>
						确定要将此条目从 {fromLang} 翻译成 {toLang} 吗？
					</p>
					<div style={{ marginTop: 10 }}>
						<Form.Item label="选择翻译API" style={{ marginBottom: 0 }}>
							<Select
								value={translationApiType}
								onChange={(value) => setTranslationApiType(value)}
								style={{ width: 200 }}
								options={[
									{ value: TranslationApiType.BAIDU, label: "百度翻译API" },
									{ value: TranslationApiType.LOCAL, label: "本地翻译库" },
								]}
							/>
							{translationApiType === TranslationApiType.BAIDU ? (
								<div style={{ fontSize: "12px", marginTop: 5 }}>使用百度翻译API（需要配置有效的API密钥）</div>
							) : (
								<div style={{ fontSize: "12px", marginTop: 5 }}>使用内置的本地翻译库（仅支持有限的词汇）</div>
							)}
						</Form.Item>
					</div>
				</>
			),
			onOk: async () => {
				try {
					setTranslating(true);

					const newData = [...data];
					const rowIndex = newData.findIndex((item) => item.key === key);

					if (rowIndex > -1) {
						const row = newData[rowIndex];
						if (row[fromLang]) {
							// if(!row[toLang] || row[toLang] === ""){
							//
							// }
							// 调用翻译API
							const translatedText = await translateText(row[fromLang], fromLang, toLang);
							row[toLang] = translatedText;

							// 更新语言文件
							const updatedLangFiles = { ...languageFiles };
							if (updatedLangFiles[toLang]) {
								updatedLangFiles[toLang][key] = translatedText;
							}

							// 更新状态
							setData(newData);
							setLanguageFiles(updatedLangFiles);

							// 由于只是单个条目的翻译，直接显示提示，不弹出额外的保存确认框
							message.success(`已翻译成 ${toLang}，可点击右上角"保存更改"按钮保存`);
						} else {
							message.warning("没有源文本或目标已有翻译");
						}
					}
				} catch (error) {
					console.error("翻译失败:", error);
					message.error("翻译失败");
				} finally {
					setTranslating(false);
				}
			},
		});
	};

	/**
	 * 创建翻译菜单
	 * @param {SupportedLocales} fromLang - 源语言
	 * @returns {JSX.Element} - 翻译菜单
	 */
	const renderTranslateMenu = (fromLang: SupportedLocales) => {
		const items = languages
			.filter((lang) => lang !== fromLang)
			.map((lang) => ({
				key: lang,
				label: `翻译成 ${lang}`,
				onClick: () => translateColumn(fromLang, lang),
			}));

		return <Menu items={items} />;
	};

	/**
	 * 创建行翻译菜单
	 * @param {string} rowKey - 行键
	 * @param {SupportedLocales} fromLang - 源语言
	 * @returns {JSX.Element} - 翻译菜单
	 */
	const renderRowTranslateMenu = (rowKey: string, fromLang: SupportedLocales) => {
		const items = languages
			.filter((lang) => lang !== fromLang)
			.map((lang) => ({
				key: lang,
				label: `翻译成 ${lang}`,
				onClick: () => translateRow(rowKey, fromLang, lang),
			}));

		return <Menu items={items} />;
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
			title: (
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span>{lang}</span>
					<Dropdown overlay={renderTranslateMenu(lang)} trigger={["click"]} disabled={translating}>
						<Tooltip title={`批量翻译 ${lang} 列`}>
							<Button type="text" size="small" icon={<TranslationOutlined />} loading={translating} />
						</Tooltip>
					</Dropdown>
				</div>
			),
			dataIndex: lang,
			key: lang,
			width: 250,
			editable: true,
			render: (text: string, record: TableRowData) => {
				return (
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span>{text}</span>
						{text && !isEditing(record) && (
							<Dropdown
								overlay={renderRowTranslateMenu(record.key, lang)}
								trigger={["click"]}
								disabled={translating || editingKey !== ""}
							>
								<Button type="text" size="small" icon={<TranslationOutlined />} loading={translating} />
							</Dropdown>
						)}
					</div>
				);
			},
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

			// 使用批量保存API，一次性保存所有文件
			const success = await batchSaveFiles(messagesData, langFiles);

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
