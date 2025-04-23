/**
 * 导入Ant Design组件
 */
import { Button, Modal, Form, Input, Select, Switch, Tabs, Spin, message } from "antd";
/**
 * 导入React Hooks
 */
import React, { useState } from "react";
/**
 * 导入代码生成器服务
 */
import {
	CodeGeneratorOptions,
	generateCode,
	exportGeneratedCode,
	GeneratedCode,
} from "@/components/LowCodeEditor/services/codeGenerator";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "@/components/LowCodeEditor/stores/components";
/**
 * 导入代码高亮库
 */
import SyntaxHighlighter from "react-syntax-highlighter";
/**
 * 导入代码高亮主题
 */
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

/**
 * 代码生成器属性接口
 * @interface CodeGeneratorProps
 */
interface CodeGeneratorProps {
	/** 是否显示对话框 */
	visible: boolean;
	/** 关闭对话框回调 */
	onClose: () => void;
}

/**
 * 代码生成器对话框组件
 *
 * 提供用户界面来配置和生成代码，支持预览和下载
 *
 * @param {CodeGeneratorProps} props - 组件属性
 * @returns {JSX.Element} 代码生成器对话框
 */
export function CodeGeneratorDialog({ visible, onClose }: CodeGeneratorProps) {
	/**
	 * 获取组件树
	 */
	const { components } = useComponetsStore();

	/**
	 * 表单实例
	 */
	const [form] = Form.useForm();

	/**
	 * 代码生成选项
	 */
	const [options, setOptions] = useState<CodeGeneratorOptions>({
		generateCSS: true,
		includeImports: true,
		framework: "react",
		fileType: "tsx",
		styleType: "css",
		generatePackageJson: true,
		generateProjectFiles: true,
	});

	/**
	 * 生成的代码
	 */
	const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);

	/**
	 * 当前选中的Tab
	 */
	const [activeTab, setActiveTab] = useState("1");

	/**
	 * 生成中状态
	 */
	const [generating, setGenerating] = useState(false);

	/**
	 * 组件名称
	 */
	const [componentName, setComponentName] = useState("GeneratedApp");

	/**
	 * 处理选项变更
	 * @param {Partial<CodeGeneratorOptions>} newOptions - 新选项
	 */
	const handleOptionsChange = (newOptions: Partial<CodeGeneratorOptions>) => {
		setOptions((prev) => ({ ...prev, ...newOptions }));
	};

	/**
	 * 处理生成代码
	 */
	const handleGenerate = async () => {
		try {
			setGenerating(true);

			// 获取表单值
			const values = await form.validateFields();
			setComponentName(values.componentName);

			// 更新选项
			const newOptions: CodeGeneratorOptions = {
				framework: values.framework,
				fileType: values.fileType,
				styleType: values.styleType,
				generateCSS: values.generateCSS,
				includeImports: values.includeImports,
				generatePackageJson: values.generatePackageJson,
				generateProjectFiles: values.generateProjectFiles,
			};

			setOptions(newOptions);

			// 生成代码
			const code = generateCode(components, values.componentName, newOptions);
			setGeneratedCode(code);

			// 切换到预览Tab
			setActiveTab("2");

			message.success("代码生成成功！");
		} catch (error) {
			console.error("生成代码出错:", error);
			message.error("生成代码失败，请检查配置");
		} finally {
			setGenerating(false);
		}
	};

	/**
	 * 处理下载代码
	 */
	const handleDownload = () => {
		if (!generatedCode) {
			message.error("请先生成代码");
			return;
		}

		exportGeneratedCode(generatedCode, componentName, options);
		message.success("代码已下载");
	};

	/**
	 * 处理关闭对话框
	 */
	const handleClose = () => {
		setGeneratedCode(null);
		setActiveTab("1");
		onClose();
	};

	/**
	 * 渲染代码生成器对话框
	 */
	return (
		<Modal
			title="代码生成器"
			open={visible}
			onCancel={handleClose}
			width={800}
			footer={[
				<Button key="close" onClick={handleClose}>
					关闭
				</Button>,
				<Button key="generate" type="primary" onClick={handleGenerate} loading={generating} disabled={activeTab !== "1"}>
					生成代码
				</Button>,
				<Button key="download" type="primary" onClick={handleDownload} disabled={!generatedCode}>
					下载代码
				</Button>,
			]}
		>
			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<Tabs.TabPane tab="配置" key="1">
					<Form
						form={form}
						layout="vertical"
						initialValues={{
							componentName: "GeneratedApp",
							framework: options.framework,
							fileType: options.fileType,
							styleType: options.styleType,
							generateCSS: options.generateCSS,
							includeImports: options.includeImports,
							generatePackageJson: options.generatePackageJson,
							generateProjectFiles: options.generateProjectFiles,
						}}
					>
						<Form.Item name="componentName" label="组件名称" rules={[{ required: true, message: "请输入组件名称" }]}>
							<Input placeholder="输入要生成的组件名称" />
						</Form.Item>

						<Form.Item name="framework" label="目标框架">
							<Select>
								<Select.Option value="react">React</Select.Option>
								<Select.Option value="vue">Vue</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item name="fileType" label="文件类型">
							<Select>
								<Select.Option value="tsx">TypeScript (.tsx)</Select.Option>
								<Select.Option value="jsx">JavaScript (.jsx)</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item name="styleType" label="样式类型">
							<Select>
								<Select.Option value="css">CSS</Select.Option>
								<Select.Option value="scss">SCSS</Select.Option>
								<Select.Option value="less">LESS</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item name="generateCSS" valuePropName="checked" label="生成样式文件">
							<Switch />
						</Form.Item>

						<Form.Item name="includeImports" valuePropName="checked" label="包含导入语句">
							<Switch />
						</Form.Item>

						<Form.Item name="generatePackageJson" valuePropName="checked" label="生成package.json">
							<Switch />
						</Form.Item>

						<Form.Item name="generateProjectFiles" valuePropName="checked" label="生成项目配置文件">
							<Switch />
						</Form.Item>
					</Form>
				</Tabs.TabPane>

				<Tabs.TabPane tab="预览" key="2">
					{generating ? (
						<div style={{ textAlign: "center", padding: "40px" }}>
							<Spin tip="正在生成代码..." />
						</div>
					) : generatedCode ? (
						<>
							<h3>组件代码</h3>
							<SyntaxHighlighter
								language={options.framework === "react" ? "jsx" : "vue"}
								style={docco}
								showLineNumbers
								customStyle={{ maxHeight: "300px", overflow: "auto" }}
							>
								{generatedCode.componentCode}
							</SyntaxHighlighter>

							{generatedCode.styleCode && (
								<>
									<h3>样式代码</h3>
									<SyntaxHighlighter
										language="css"
										style={docco}
										showLineNumbers
										customStyle={{ maxHeight: "200px", overflow: "auto" }}
									>
										{generatedCode.styleCode}
									</SyntaxHighlighter>
								</>
							)}

							{generatedCode.packageJson && (
								<>
									<h3>package.json</h3>
									<SyntaxHighlighter
										language="json"
										style={docco}
										showLineNumbers
										customStyle={{ maxHeight: "200px", overflow: "auto" }}
									>
										{generatedCode.packageJson}
									</SyntaxHighlighter>
								</>
							)}

							{generatedCode.indexHtml && (
								<>
									<h3>index.html</h3>
									<SyntaxHighlighter
										language="html"
										style={docco}
										showLineNumbers
										customStyle={{ maxHeight: "200px", overflow: "auto" }}
									>
										{generatedCode.indexHtml}
									</SyntaxHighlighter>
								</>
							)}

							{generatedCode.viteConfig && (
								<>
									<h3>vite.config.ts</h3>
									<SyntaxHighlighter
										language="typescript"
										style={docco}
										showLineNumbers
										customStyle={{ maxHeight: "200px", overflow: "auto" }}
									>
										{generatedCode.viteConfig}
									</SyntaxHighlighter>
								</>
							)}
						</>
					) : (
						<div style={{ textAlign: "center", padding: "40px" }}>
							<p>请先生成代码</p>
						</div>
					)}
				</Tabs.TabPane>
			</Tabs>
		</Modal>
	);
}
