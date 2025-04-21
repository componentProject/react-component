/**
 * 导入样式
 */
import styles from "./index.module.scss";

/**
 * 导入logo图标
 */
import logoSvg from "./icons/logo.svg";
/**
 * 导入React钩子
 */
import { useContext, useState, useEffect } from "react";
/**
 * 导入Playground上下文
 */
import { PlaygroundContext, Snapshot } from "@/components/Playground/PlaygroundContext.tsx";
/**
 * 导入Ant Design图标和组件
 */
import {
	DownloadOutlined,
	MoonOutlined,
	ShareAltOutlined,
	SunOutlined,
	SaveOutlined,
	HistoryOutlined,
	AppstoreOutlined,
} from "@ant-design/icons";
/**
 * 导入Ant Design组件
 */
import { message, Modal, Input, List, Button, Popconfirm, Card, Row, Col } from "antd";
/**
 * 导入复制到剪贴板工具
 */
import copy from "copy-to-clipboard";
/**
 * 导入文件下载工具
 */
import { downloadFiles } from "@/components/Playground/utils";
/**
 * 导入模板定义
 */
import { loadTemplates, TemplateId } from "@/components/Playground/files";

/**
 * Header组件
 *
 * 显示应用顶部导航栏，包含标志、主题切换、分享和下载按钮
 * 使用方法: <Header />
 */
export default function Header() {
	/**
	 * 从上下文中获取文件、主题和设置主题函数
	 */
	const { files, theme, setTheme, snapshots, createSnapshot, loadSnapshot, deleteSnapshot, setFiles, setSelectedFileName } =
		useContext(PlaygroundContext);

	/**
	 * 快照相关状态
	 */
	const [isSnapshotModalVisible, setIsSnapshotModalVisible] = useState(false);
	const [snapshotName, setSnapshotName] = useState("");
	const [isSnapshotListVisible, setIsSnapshotListVisible] = useState(false);
	/**
	 * 模板相关状态
	 */
	const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);

	/**
	 * 模板列表状态
	 */
	const [localTemplates, setLocalTemplates] = useState<Record<string, any>>({});
	const [templatesLoaded, setTemplatesLoaded] = useState(false);

	/**
	 * 加载模板
	 */
	useEffect(() => {
		const loadAllTemplates = async () => {
			try {
				if (!templatesLoaded) {
					const { templates: loadedTemplates } = await loadTemplates();
					console.log("loadedTemplates", loadedTemplates);
					setLocalTemplates(loadedTemplates);
					setTemplatesLoaded(true);
					console.log("模板加载完成:", Object.keys(loadedTemplates));
				}
			} catch (error) {
				console.error("加载模板列表失败:", error);
				message.error("加载模板列表失败");
			}
		};

		loadAllTemplates();
	}, [templatesLoaded]);

	/**
	 * 创建快照方法
	 */
	const handleCreateSnapshot = () => {
		createSnapshot(snapshotName);
		setSnapshotName("");
		setIsSnapshotModalVisible(false);
		message.success("快照创建成功");
	};

	/**
	 * 加载快照方法
	 * @param snapshot 快照对象
	 */
	const handleLoadSnapshot = (snapshot: Snapshot) => {
		loadSnapshot(snapshot.id);
		setIsSnapshotListVisible(false);
		message.success(`已加载快照: ${snapshot.name}`);
	};

	/**
	 * 加载模板方法
	 * @param templateId 模板ID
	 */
	const handleLoadTemplate = async (templateId: TemplateId) => {
		Modal.confirm({
			title: "切换模板",
			content: "切换模板将会覆盖当前的所有文件，是否继续？",
			okText: "确定",
			cancelText: "取消",
			onOk: async () => {
				try {
					// 禁用缓存，强制重新加载模板
					setTemplatesLoaded(false);

					// 确保模板已加载
					const { templates: loadedTemplates } = await loadTemplates();
					console.log("重新加载的模板:", loadedTemplates);
					setLocalTemplates(loadedTemplates);

					if (!loadedTemplates[templateId]) {
						message.error(`模板 ${templateId} 不存在或加载失败`);
						return;
					}

					// 深度克隆文件对象，避免引用问题
					const templateFiles = JSON.parse(JSON.stringify(loadedTemplates[templateId].files));

					// 设置文件并关闭模态框
					console.log(`正在加载模板: ${templateId}, 文件数量: ${Object.keys(templateFiles).length}`, templateFiles);
					setFiles(templateFiles);

					// 重置选择的文件为入口文件
					const firstFile = Object.keys(templateFiles)[0] || "App.tsx";
					setSelectedFileName(firstFile);
					setIsTemplateModalVisible(false);
					message.success(`已加载模板: ${loadedTemplates[templateId].name}`);
				} catch (error) {
					console.error("加载模板失败:", error);
					message.error("加载模板失败");
				}
			},
		});
	};

	/**
	 * 渲染Header界面
	 */
	return (
		<div className={styles.header}>
			{/* 左侧Logo部分 */}
			<div className={styles.logo}>
				<img alt="logo" src={logoSvg} />
				<span>React Playground</span>
			</div>
			{/* 右侧功能按钮部分 */}
			<div className={styles.links}>
				{/* 模板按钮 */}
				<AppstoreOutlined title="选择模板" style={{ marginRight: "10px" }} onClick={() => setIsTemplateModalVisible(true)} />
				{/* 保存快照按钮 */}
				<SaveOutlined title="创建快照" style={{ marginRight: "10px" }} onClick={() => setIsSnapshotModalVisible(true)} />
				{/* 快照列表按钮 */}
				<HistoryOutlined title="浏览快照" style={{ marginRight: "10px" }} onClick={() => setIsSnapshotListVisible(true)} />
				{/* 主题切换按钮 - 当前为亮色主题时显示月亮图标 */}
				{theme === "light" && <MoonOutlined title="切换暗色主题" className={styles.theme} onClick={() => setTheme("dark")} />}
				{/* 主题切换按钮 - 当前为暗色主题时显示太阳图标 */}
				{theme === "dark" && <SunOutlined title="切换亮色主题" className={styles.theme} onClick={() => setTheme("light")} />}
				{/* 分享按钮 */}
				<ShareAltOutlined
					style={{ marginLeft: "10px" }}
					onClick={() => {
						copy(window.location.href);
						message.success("分享链接已复制。");
					}}
				/>
				{/* 下载按钮 */}
				<DownloadOutlined
					style={{ marginLeft: "10px" }}
					onClick={async () => {
						await downloadFiles(files);
						message.success("下载完成");
					}}
				/>
			</div>

			{/* 创建快照对话框 */}
			<Modal
				title="创建快照"
				open={isSnapshotModalVisible}
				onOk={handleCreateSnapshot}
				onCancel={() => setIsSnapshotModalVisible(false)}
				okText="保存"
				cancelText="取消"
			>
				<Input placeholder="输入快照名称" value={snapshotName} onChange={(e) => setSnapshotName(e.target.value)} />
			</Modal>

			{/* 快照列表对话框 */}
			<Modal
				title="快照列表"
				open={isSnapshotListVisible}
				footer={null}
				onCancel={() => setIsSnapshotListVisible(false)}
				width={600}
			>
				{snapshots.length === 0 ? (
					<div style={{ textAlign: "center", padding: "20px" }}>暂无保存的快照</div>
				) : (
					<List
						itemLayout="horizontal"
						dataSource={snapshots as Snapshot[]}
						renderItem={(snapshot: Snapshot) => (
							<List.Item
								actions={[
									<Button key="load" type="link" onClick={() => handleLoadSnapshot(snapshot)}>
										加载
									</Button>,
									<Popconfirm
										key="delete"
										title="确定要删除此快照吗？"
										onConfirm={() => {
											deleteSnapshot(snapshot.id);
											message.success("快照已删除");
										}}
										okText="确定"
										cancelText="取消"
									>
										<Button type="link" danger>
											删除
										</Button>
									</Popconfirm>,
								]}
							>
								<List.Item.Meta title={snapshot.name} description={`创建于 ${new Date(snapshot.createdAt).toLocaleString()}`} />
							</List.Item>
						)}
					/>
				)}
			</Modal>

			{/* 模板选择对话框 */}
			<Modal
				title="选择模板"
				open={isTemplateModalVisible}
				footer={null}
				onCancel={() => setIsTemplateModalVisible(false)}
				width={800}
			>
				<Row gutter={[16, 16]}>
					{Object.values(localTemplates).map((template) => (
						<Col span={12} key={template.id}>
							<Card title={template.name} hoverable onClick={() => handleLoadTemplate(template.id)}>
								<p>{template.description}</p>
								<Button type="primary">使用此模板</Button>
							</Card>
						</Col>
					))}
				</Row>
			</Modal>
		</div>
	);
}
