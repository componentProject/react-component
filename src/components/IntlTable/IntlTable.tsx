/**
 * @file IntlTable.tsx
 * @description 国际化资源管理表格组件
 */

/** 导入React相关依赖 */
import React, { useState, useEffect } from "react";
/** 导入antd组件 */
import { Table, Button, Upload, message, Form, Alert, Space, Modal, Dropdown, Tooltip, Select, Progress } from "antd";
import type { MenuProps } from "antd";
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
/** 导入transformers.js */
import { pipeline } from "@xenova/transformers";
import { useIntl, FormattedMessage } from "react-intl";
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
 * @property {string} key - 动态语言键值对
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
	TRANSFORMERS = "transformers",
}

/**
 * @component IntlTable
 * @description 这是一个国际化表格组件，功能是管理多语言资源，支持导入导出Excel，编辑和保存多语言内容,
 *
 * 依赖node服务才能同步修改本地src/locales下文件
 */
const IntlTable: React.FC<IntlTableProps> = (props) => {
	const intl = useIntl();

	// 翻译函数
	const formatMessage = (id: string, defaultMessage: string, values?: Record<string, any>) => {
		return intl.formatMessage({ id, defaultMessage }, values);
	};

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

	/** 定义翻译API类型的默认值 */
	const defaultApiType = TranslationApiType.BAIDU;

	/** 添加翻译确认弹窗状态 */
	const [modalVisible, setModalVisible] = useState(false);
	const [modalTranslationApiType, setModalTranslationApiType] = useState(defaultApiType);
	const [modalType, setModalType] = useState<"column" | "row" | null>(null);
	const [modalData, setModalData] = useState<{
		fromLang?: SupportedLocales;
		toLang?: SupportedLocales;
		key?: string;
	}>({});
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [isDownloading, setIsDownloading] = useState(false);
	const [isTranslating, setIsTranslating] = useState(false);
	const [translationProgress, setTranslationProgress] = useState(0);
	const [translationTotal, setTranslationTotal] = useState(0);
	const [translationCurrent, setTranslationCurrent] = useState(0);

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
				message.success(formatMessage("intl.message.update.success", "更新成功"));
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
			message.error(formatMessage("intl.message.save.failed", "保存失败"));
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
			console.log("messages", messages);
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

			// 收集所有语言文件中出现的ID，确保不遗漏任何ID
			const allKeys = new Set<string>();

			// 先添加messages中定义的所有key
			Object.keys(messages).forEach((key) => allKeys.add(key));

			// 然后添加各语言文件中可能存在但未在messages中定义的key
			supportedLocales.forEach((locale) => {
				Object.keys(langFiles[locale]).forEach((key) => allKeys.add(key));
			});

			// 组装表格数据
			const tableData: TableRowData[] = [];
			allKeys.forEach((key) => {
				// 对于每个ID，创建一个行数据对象
				const rowData: TableRowData = {
					key,
					id: key,
					// 如果messages中存在该key，使用其defaultMessage，否则使用空字符串
					defaultMessage: messages[key]?.defaultMessage || "",
					// 如果messages中存在该key，使用其description，否则使用空字符串
					description: messages[key]?.description || "",
				};

				// 如果该key在messages中不存在，将其添加到messagesData中
				if (!messages[key]) {
					// 尝试从语言文件中找到相应的文本作为默认值
					let defaultText = "";
					for (const locale of supportedLocales) {
						if (langFiles[locale][key]) {
							defaultText = langFiles[locale][key];
							break;
						}
					}

					// 将新的key添加到messagesData
					setMessagesData((prev) => ({
						...prev,
						[key]: {
							defaultMessage: defaultText,
							description: "",
						},
					}));
				}

				// 设置每种语言的翻译
				supportedLocales.forEach((lang) => {
					rowData[lang] = langFiles[lang][key] || "";
				});

				tableData.push(rowData);
			});
			console.log("tableData", tableData);
			setData(tableData);
		} catch (error) {
			console.error("Failed to load data:", error);
			message.error(formatMessage("intl.message.load.failed", "加载数据失败"));
		} finally {
			setLoading(false);
		}
	};

	/**
	 * @method translateWithTransformers
	 * @description 使用Transformers.js进行翻译
	 * @param {string} text - 要翻译的文本
	 * @param {string} fromLang - 源语言
	 * @param {string} toLang - 目标语言
	 * @returns {Promise<string>} - 翻译后的文本
	 */
	const translateWithTransformers = async (text: string, fromLang: string, toLang: string): Promise<string> => {
		try {
			setIsDownloading(true);
			const translator = await pipeline("translation", "Xenova/nllb-200-distilled-600M", {
				quantized: true,
				progress_callback: ({ progress }) => {
					setDownloadProgress(progress);
				},
				model_url: "https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/onnx/encoder_model_quantized.onnx",
				config_url: "https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/config.json",
				tokenizer_url: "https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/tokenizer.json",
			} as any);
			const result = await translator(text, {
				src_lang: fromLang.toUpperCase(),
				tgt_lang: toLang.toUpperCase(),
			} as any);
			return (result as any)[0].translation_text;
		} catch (error) {
			console.error("Transformers.js translation failed:", error);
			message.error(formatMessage("intl.message.transformers.error", "Transformers.js 翻译失败"));
			return text; // 翻译失败时返回原文本
		} finally {
			setIsDownloading(false);
			setDownloadProgress(0);
		}
	};

	/**
	 * @method handleBaiduApiError
	 * @description 处理百度翻译API错误，显示确认弹窗
	 * @param {string} text - 要翻译的文本
	 * @param {string} fromLang - 源语言
	 * @param {string} toLang - 目标语言
	 * @param {string} errorMsg - 错误信息
	 * @returns {Promise<string>} - 翻译后的文本
	 */
	const handleBaiduApiError = (text: string, fromLang: string, toLang: string, errorMsg: string): Promise<string> => {
		console.error("百度翻译API错误:", errorMsg);

		return new Promise((resolve, reject) => {
			Modal.confirm({
				title: formatMessage("intl.modal.baidu.api.error.title", "翻译API调用失败"),
				content: (
					<div>
						<p>
							{formatMessage("intl.modal.baidu.api.error.content", "百度翻译API调用失败，是否使用Transformers.js进行离线翻译？")}
						</p>
						<p style={{ color: "#ff4d4f" }}>
							{formatMessage("intl.modal.baidu.api.error.warning", "注意：首次使用需要下载模型，可能需要一些时间。")}
						</p>
						<p style={{ color: "#ff4d4f" }}>
							{formatMessage("intl.modal.baidu.api.error.message", "错误信息: {errorMsg}", { errorMsg })}
						</p>
					</div>
				),
				okText: formatMessage("intl.modal.baidu.api.error.use.transformers", "使用Transformers.js"),
				cancelText: formatMessage("intl.button.cancel", "取消"),
				onOk: async () => {
					try {
						const result = await translateWithTransformers(text, fromLang, toLang);
						resolve(result);
					} catch (error) {
						message.error(formatMessage("intl.message.transformers.error", "Transformers.js 翻译失败"));
						reject(error);
					}
				},
				onCancel: () => {
					message.info(formatMessage("intl.modal.baidu.api.error.user.cancel", "用户取消使用Transformers.js翻译"));
					reject(formatMessage("intl.modal.baidu.api.error.user.cancel", "用户取消使用Transformers.js翻译"));
				},
			});
		});
	};

	/**
	 * @method translateColumn
	 * @description 翻译整列数据
	 * @param {SupportedLocales} fromLang - 源语言
	 * @param {SupportedLocales} toLang - 目标语言
	 */
	const translateColumn = (fromLang: SupportedLocales, toLang: SupportedLocales) => {
		setModalType("column");
		setModalData({ fromLang, toLang });
		setModalTranslationApiType(modalTranslationApiType);
		setModalVisible(true);
	};

	/**
	 * @method translateRow
	 * @description 翻译单行数据
	 * @param {string} key - 行 ID
	 * @param {SupportedLocales} fromLang - 源语言
	 * @param {SupportedLocales} toLang - 目标语言
	 */
	const translateRow = (key: string, fromLang: SupportedLocales, toLang: SupportedLocales) => {
		setModalType("row");
		setModalData({ key, fromLang, toLang });
		setModalTranslationApiType(modalTranslationApiType);
		setModalVisible(true);
	};

	const handleModalOk = async () => {
		try {
			if (modalTranslationApiType === TranslationApiType.TRANSFORMERS) {
				setIsDownloading(true);
				setIsTranslating(true);
			} else {
				setIsTranslating(true);
			}
			if (modalType === "column" && modalData.fromLang && modalData.toLang) {
				const newData = [...data];
				const updatedLangFiles = { ...languageFiles };
				const totalItems = newData.filter((row) => row[modalData.fromLang!]).length;
				setTranslationTotal(totalItems);
				setTranslationCurrent(0);

				// 翻译空白内容
				for (let i = 0; i < newData.length; i++) {
					const row = newData[i];
					if (row[modalData.fromLang!]) {
						const translatedText = await translateText(
							row[modalData.fromLang!],
							modalData.fromLang!,
							modalData.toLang!,
							modalTranslationApiType,
						);
						if (translatedText) {
							row[modalData.toLang!] = translatedText;
						}

						// 更新语言文件
						if (updatedLangFiles[modalData.toLang!]) {
							updatedLangFiles[modalData.toLang!][row.key] = translatedText;
						}

						setTranslationCurrent((prev) => prev + 1);
						setTranslationProgress(Math.round(((i + 1) / totalItems) * 100));
					}
				}

				// 更新状态
				setData(newData);
				setLanguageFiles(updatedLangFiles);

				// 翻译完成后提示
				Modal.confirm({
					title: formatMessage("intl.modal.translate.completed", "翻译完成"),
					content: formatMessage("intl.modal.translate.save.confirm", "是否立即保存更改到服务器？"),
					onOk: async () => {
						const success = await saveAllFiles(updatedLangFiles, messagesData);
						if (success) {
							message.success(formatMessage("intl.message.translate.save.success", "已将翻译保存到服务器"));
						}
						setModalVisible(false);
					},
					onCancel: () => {
						setModalVisible(false);
					},
					okText: formatMessage("intl.modal.save.and.close", "保存并关闭"),
					cancelText: formatMessage("intl.modal.close.only", "仅关闭"),
				});

				message.success(
					formatMessage("intl.message.translate.column.success", "已将 {fromLang} 列翻译成 {toLang}", {
						fromLang: modalData.fromLang,
						toLang: modalData.toLang,
					}),
				);
			} else if (modalType === "row" && modalData.key && modalData.fromLang && modalData.toLang) {
				const newData = [...data];
				const rowIndex = newData.findIndex((item) => item.key === modalData.key);

				if (rowIndex > -1) {
					const row = newData[rowIndex];
					if (row[modalData.fromLang]) {
						setTranslationTotal(1);
						setTranslationCurrent(0);
						setTranslationProgress(0);

						const translatedText = await translateText(
							row[modalData.fromLang],
							modalData.fromLang,
							modalData.toLang,
							modalTranslationApiType,
						);
						row[modalData.toLang] = translatedText;

						setTranslationCurrent(1);
						setTranslationProgress(100);

						// 更新语言文件
						const updatedLangFiles = { ...languageFiles };
						if (updatedLangFiles[modalData.toLang]) {
							updatedLangFiles[modalData.toLang][modalData.key] = translatedText;
						}

						// 更新状态
						setData(newData);
						setLanguageFiles(updatedLangFiles);

						// 翻译完成后提示
						Modal.confirm({
							title: formatMessage("intl.modal.translate.completed", "翻译完成"),
							content: formatMessage("intl.modal.translate.save.confirm", "是否立即保存更改到服务器？"),
							onOk: async () => {
								const success = await saveAllFiles(updatedLangFiles, messagesData);
								if (success) {
									message.success(formatMessage("intl.message.translate.save.success", "已将翻译保存到服务器"));
								}
								setModalVisible(false);
							},
							onCancel: () => {
								setModalVisible(false);
							},
							okText: formatMessage("intl.modal.save.and.close", "保存并关闭"),
							cancelText: formatMessage("intl.modal.close.only", "仅关闭"),
						});

						message.success(
							formatMessage("intl.message.translate.row.success", "已翻译成 {toLang}", { toLang: modalData.toLang }),
						);
					} else {
						message.warning(formatMessage("intl.message.translate.no.source", "没有源文本或目标已有翻译"));
						setModalVisible(false);
					}
				}
			}
		} catch (error) {
			console.error("翻译失败:", error);
			message.error(formatMessage("intl.message.translate.failed", "翻译失败"));
			setModalVisible(false);
		} finally {
			setIsDownloading(false);
			setIsTranslating(false);
			setDownloadProgress(0);
			setTranslationProgress(0);
			setTranslationCurrent(0);
			setTranslationTotal(0);
		}
	};

	/**
	 * @method translateText
	 * @description 调用翻译API翻译文本
	 * @param {string} text - 要翻译的文本
	 * @param {string} fromLang - 源语言
	 * @param {string} toLang - 目标语言
	 * @param {TranslationApiType} apiType - 翻译API类型
	 * @returns {Promise<string>} - 翻译后的文本
	 */
	const translateText = async (
		text: string,
		fromLang: string,
		toLang: string,
		apiType: TranslationApiType = defaultApiType,
	): Promise<string> => {
		// 使用百度翻译API
		if (apiType === TranslationApiType.BAIDU) {
			try {
				const from = fromLang.slice(0, 2);
				const to = toLang.slice(0, 2);
				const data = await Api.translateApi.translate({
					q: text,
					from,
					to,
				});

				// 如果返回了错误码
				if (data.error_code) {
					return handleBaiduApiError(text, fromLang, toLang, `${data.error_code} - ${data.error_msg}`);
				}

				if (data && data.trans_result && data.trans_result.length > 0) {
					return data.trans_result[0].dst;
				}

				return handleBaiduApiError(text, fromLang, toLang, "翻译结果为空");
			} catch (error: any) {
				return handleBaiduApiError(text, fromLang, toLang, error.message || "未知错误");
			}
		}

		// 使用Transformers.js翻译
		if (apiType === TranslationApiType.TRANSFORMERS) {
			return translateWithTransformers(text, fromLang, toLang);
		}

		// 如果传入了未知的API类型
		message.error(formatMessage("intl.error.unknown.api.type", "未知的翻译API类型"));
		return text; // 返回原文本
	};

	/**
	 * 创建翻译菜单
	 * @param {SupportedLocales} fromLang - 源语言
	 * @returns {MenuProps} - 翻译菜单配置
	 */
	const renderTranslateMenu = (fromLang: SupportedLocales): MenuProps => {
		const menuItems = languages
			.filter((lang) => lang !== fromLang)
			.map((lang) => ({
				key: lang,
				label: intl.formatMessage({ id: "intl.menu.translate.to", defaultMessage: "翻译成 {lang}" }, { lang }),
				onClick: () => translateColumn(fromLang, lang),
			}));

		return { items: menuItems };
	};

	/**
	 * 创建行翻译菜单
	 * @param {string} rowKey - 行键
	 * @param {SupportedLocales} fromLang - 源语言
	 * @returns {MenuProps} - 翻译菜单配置
	 */
	const renderRowTranslateMenu = (rowKey: string, fromLang: SupportedLocales): MenuProps => {
		const menuItems = languages
			.filter((lang) => lang !== fromLang)
			.map((lang) => ({
				key: lang,
				label: intl.formatMessage({ id: "intl.menu.translate.to", defaultMessage: "翻译成 {lang}" }, { lang }),
				onClick: () => translateRow(rowKey, fromLang, lang),
			}));

		return { items: menuItems };
	};

	/**
	 * @type {Array<any>} columns - 表格列定义，扩展了antd列类型，添加了editable属性
	 */
	const columns: any[] = [
		{
			title: <FormattedMessage id="intl.table.column.id" defaultMessage="ID" />,
			dataIndex: "id",
			key: "id",
			width: 200,
			editable: false,
			sorter: (a: TableRowData, b: TableRowData) => a.id.localeCompare(b.id),
		},
		{
			title: <FormattedMessage id="intl.table.column.defaultMessage" defaultMessage="默认文本" />,
			dataIndex: "defaultMessage",
			key: "defaultMessage",
			width: 200,
			editable: true,
		},
		{
			title: <FormattedMessage id="intl.table.column.description" defaultMessage="描述" />,
			dataIndex: "description",
			key: "description",
			width: 300,
			editable: true,
		},
		...languages.map((lang: SupportedLocales) => ({
			title: (
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span>{lang}</span>
					<Dropdown menu={renderTranslateMenu(lang)} trigger={["click"]} disabled={isTranslating}>
						<Tooltip
							title={intl.formatMessage(
								{ id: "intl.table.column.translate.tooltip", defaultMessage: "批量翻译 {lang} 列" },
								{ lang },
							)}
						>
							<Button type="text" size="small" icon={<TranslationOutlined />} loading={isTranslating} />
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
								menu={renderRowTranslateMenu(record.key, lang)}
								trigger={["click"]}
								disabled={isTranslating || editingKey !== ""}
							>
								<Button type="text" size="small" icon={<TranslationOutlined />} loading={isTranslating} />
							</Dropdown>
						)}
					</div>
				);
			},
		})),
		{
			title: <FormattedMessage id="intl.table.column.operation" defaultMessage="操作" />,
			dataIndex: "operation",
			width: 150,
			render: (_: any, record: TableRowData) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Button type="link" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
							<FormattedMessage id="intl.button.save" defaultMessage="保存" />
						</Button>
						<Button type="link" onClick={cancel}>
							<FormattedMessage id="intl.button.cancel" defaultMessage="取消" />
						</Button>
					</span>
				) : (
					<Button type="link" disabled={editingKey !== ""} onClick={() => edit(record)}>
						<FormattedMessage id="intl.button.edit" defaultMessage="编辑" />
					</Button>
				);
			},
		},
	];

	/**
	 * @type {Array<any>} mergedColumns - 合并后的表格列定义
	 */
	const mergedColumns: any[] = columns.map((col: any) => {
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
			const excelWorksheet = workbook.addWorksheet(formatMessage("intl.excel.sheet.name", "国际化数据"));

			// 设置列标题
			excelWorksheet.columns = [
				{ header: formatMessage("intl.table.column.id", "ID"), key: "id", width: 30 },
				{ header: formatMessage("intl.table.column.defaultMessage", "默认文本"), key: "defaultMessage", width: 30 },
				{ header: formatMessage("intl.table.column.description", "描述"), key: "description", width: 50 },
				...languages.map((lang) => ({
					header: lang,
					key: lang,
					width: 30,
				})),
			];

			// 添加数据行
			excelWorksheet.addRows(data);

			// 设置表头样式
			const headerRow = excelWorksheet.getRow(1);
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
			link.download = formatMessage("intl.excel.file.name", "国际化数据.xlsx");
			link.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error(formatMessage("intl.error.export.excel", "导出Excel失败:"), error);
			message.error(formatMessage("intl.message.export.failed", "导出Excel失败"));
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
			const excelWorksheet = workbook.getWorksheet(1);

			if (!excelWorksheet) {
				message.error(formatMessage("intl.error.excel.read", "无法读取Excel文件"));
				return;
			}

			// 获取列标题
			const headers = excelWorksheet.getRow(1).values as string[];
			const idIndex = headers.indexOf("ID");
			const defaultMessageIndex = headers.indexOf("默认文本");
			const descriptionIndex = headers.indexOf("描述");
			const langIndices = languages.map((lang) => headers.indexOf(lang));

			if (idIndex === -1 || defaultMessageIndex === -1) {
				message.error(formatMessage("intl.error.excel.format", "Excel文件格式不正确"));
				return;
			}

			// 解析数据
			const newMessagesData: MessagesType = {};
			const newLangFiles: Record<SupportedLocales, TranslationType> = {} as Record<SupportedLocales, TranslationType>;
			languages.forEach((lang) => {
				newLangFiles[lang] = {};
			});

			excelWorksheet.eachRow((row, rowNumber) => {
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
			message.success(formatMessage("intl.message.import.success", "导入成功"));
			await fetchData();
		} catch (error) {
			console.error(formatMessage("intl.error.import.excel", "导入Excel失败:"), error);
			message.error(formatMessage("intl.message.import.failed", "导入Excel失败"));
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
			console.error(formatMessage("intl.error.save.files", "保存文件失败:"), error);
			message.error(formatMessage("intl.message.save.files.failed", "保存文件失败"));
			setLoading(false);
			return false;
		}
	};

	/**
	 * 添加新的国际化条目
	 */
	const addNewItem = () => {
		// 生成一个唯一的key，使用时间戳作为后缀
		const newKey = `new.item.${Date.now()}`;

		// 创建新条目
		const newItem: TableRowData = {
			key: newKey,
			id: newKey,
			defaultMessage: "",
			description: "",
		};

		// 为每种语言添加空翻译
		languages.forEach((lang) => {
			newItem[lang] = "";
		});

		// 更新表格数据
		const newData = [...data, newItem];
		setData(newData);

		// 更新消息定义
		setMessagesData((prev) => ({
			...prev,
			[newKey]: {
				defaultMessage: "",
				description: "",
			},
		}));

		// 立即进入编辑模式
		setEditingKey(newKey);
	};

	return (
		<div className="intl-table">
			<Alert
				message={<FormattedMessage id="intl.management.title" defaultMessage="国际化资源管理" />}
				description={
					<div>
						<p>
							<FormattedMessage
								id="intl.management.description"
								defaultMessage="通过此表格可以管理多语言翻译资源，支持编辑、导入、导出功能。"
							/>
						</p>
						<p>
							<FormattedMessage
								id="intl.management.save.description"
								defaultMessage="修改会保存到对应的语言文件中，以便在应用中使用。"
							/>
						</p>
					</div>
				}
				type="info"
				showIcon
				style={{ marginBottom: 16 }}
			/>

			<div
				className="intl-table-header"
				style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}
			>
				<Space>
					<Upload beforeUpload={importFromExcel} showUploadList={false} accept=".xlsx,.xls">
						<Button icon={<UploadOutlined />} loading={loading}>
							<FormattedMessage id="intl.button.import.excel" defaultMessage="导入Excel" />
						</Button>
					</Upload>
					<Button icon={<DownloadOutlined />} onClick={exportToExcel} loading={loading}>
						<FormattedMessage id="intl.button.export.excel" defaultMessage="导出Excel" />
					</Button>
					<Button
						icon={<SaveOutlined />}
						onClick={async () => {
							const success = await saveAllFiles(languageFiles, messagesData);
							if (success) {
								message.success(
									intl.formatMessage({ id: "intl.message.save.success", defaultMessage: "已保存所有更改到源代码文件" }),
								);
							}
						}}
						disabled={loading}
					>
						<FormattedMessage id="intl.button.save.changes" defaultMessage="保存更改" />
					</Button>
					<Button
						icon={<SyncOutlined />}
						onClick={async () => {
							clearCache();
							await fetchData();
							message.success(
								intl.formatMessage({ id: "intl.message.refresh.success", defaultMessage: "已重新从源文件加载数据" }),
							);
						}}
						type="primary"
					>
						<FormattedMessage id="intl.button.refresh.data" defaultMessage="刷新数据" />
					</Button>
					<Button type="primary" onClick={addNewItem} disabled={loading || editingKey !== ""}>
						<FormattedMessage id="intl.button.add.item" defaultMessage="添加条目" />
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

			{/* 添加翻译确认弹窗 */}
			<Modal
				title={<FormattedMessage id="intl.modal.translate.confirm.title" defaultMessage="翻译确认" />}
				open={modalVisible}
				onOk={handleModalOk}
				onCancel={() => {
					if (!isTranslating && !isDownloading) {
						setModalVisible(false);
						setDownloadProgress(0);
						setIsDownloading(false);
						setIsTranslating(false);
						setTranslationProgress(0);
						setTranslationCurrent(0);
						setTranslationTotal(0);
					} else {
						message.warning(intl.formatMessage({ id: "intl.modal.translate.warning", defaultMessage: "正在翻译中，请等待完成" }));
					}
				}}
				okText={
					isTranslating || isDownloading ? (
						<FormattedMessage id="intl.modal.translate.button.processing" defaultMessage="处理中..." />
					) : (
						<FormattedMessage id="intl.modal.translate.button.confirm" defaultMessage="确定" />
					)
				}
				cancelText={<FormattedMessage id="intl.modal.translate.button.cancel" defaultMessage="取消" />}
				okButtonProps={{ disabled: isTranslating || isDownloading }}
			>
				<p>
					{modalType === "column"
						? intl.formatMessage(
								{
									id: "intl.modal.translate.column.confirm",
									defaultMessage: "确定要将 {fromLang} 列翻译成 {toLang} 吗？这将覆盖 {toLang} 列的现有空白内容。",
								},
								{ fromLang: modalData.fromLang, toLang: modalData.toLang },
							)
						: intl.formatMessage(
								{ id: "intl.modal.translate.row.confirm", defaultMessage: "确定要将此条目从 {fromLang} 翻译成 {toLang} 吗？" },
								{ fromLang: modalData.fromLang, toLang: modalData.toLang },
							)}
				</p>
				<div style={{ marginTop: 10 }}>
					<Form.Item
						label={intl.formatMessage({ id: "intl.modal.translate.api.select", defaultMessage: "选择翻译API" })}
						style={{ marginBottom: 0 }}
					>
						<Select
							value={modalTranslationApiType}
							onChange={(value) => {
								if (value === TranslationApiType.BAIDU || value === TranslationApiType.TRANSFORMERS) {
									setModalTranslationApiType(value);
								}
							}}
							style={{ width: 200 }}
							options={[
								{
									value: TranslationApiType.BAIDU,
									label: intl.formatMessage({ id: "intl.modal.translate.api.baidu", defaultMessage: "百度翻译API" }),
								},
								{
									value: TranslationApiType.TRANSFORMERS,
									label: intl.formatMessage({ id: "intl.modal.translate.api.transformers", defaultMessage: "Transformers.js" }),
								},
							]}
							disabled={isTranslating || isDownloading}
						/>
						{modalTranslationApiType === TranslationApiType.BAIDU ? (
							<div style={{ fontSize: "12px", marginTop: 5 }}>
								<FormattedMessage
									id="intl.modal.translate.api.baidu.desc"
									defaultMessage="使用百度翻译API（需要配置有效的API密钥）"
								/>
							</div>
						) : (
							<div style={{ fontSize: "12px", marginTop: 5 }}>
								<FormattedMessage
									id="intl.modal.translate.api.transformers.desc"
									defaultMessage="使用Transformers.js离线翻译（首次使用需要下载模型）"
								/>
							</div>
						)}
					</Form.Item>
					{modalTranslationApiType === TranslationApiType.TRANSFORMERS && isDownloading && (
						<div style={{ marginTop: 10 }}>
							<div>
								<FormattedMessage id="intl.modal.translate.downloading" defaultMessage="正在下载模型..." />
							</div>
							<Progress percent={downloadProgress} status="active" />
						</div>
					)}
					{isTranslating && (
						<div style={{ marginTop: 10 }}>
							<div>
								<FormattedMessage
									id="intl.modal.translate.progress"
									defaultMessage="正在翻译... ({current}/{total})"
									values={{ current: translationCurrent, total: translationTotal }}
								/>
							</div>
							<Progress percent={translationProgress} status="active" />
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default IntlTable;
