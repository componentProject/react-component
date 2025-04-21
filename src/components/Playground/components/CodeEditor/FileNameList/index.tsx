/**
 * 导入React相关钩子
 */
import { useContext, useEffect, useState } from "react";
/**
 * 导入Playground上下文
 */
import { PlaygroundContext } from "@/components/Playground/PlaygroundContext.tsx";

/**
 * 导入文件名项组件
 */
import { FileNameItem } from "./FileNameItem";
/**
 * 导入样式
 */
import styles from "./index.module.scss";
/**
 * 导入文件名常量
 */
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from "@/components/Playground/files";

/**
 * 文件名列表组件
 *
 * 显示和管理代码文件选项卡，支持添加、重命名和删除文件
 * 使用方法: <FileNameList />
 */
export default function FileNameList() {
	/**
	 * 从上下文中获取文件和文件操作相关状态与函数
	 */
	const { files, removeFile, addFile, updateFileName, selectedFileName, setSelectedFileName } = useContext(PlaygroundContext);

	/**
	 * 文件选项卡状态
	 */
	const [tabs, setTabs] = useState([""]);

	/**
	 * 当文件列表变化时更新选项卡
	 */
	useEffect(() => {
		setTabs(Object.keys(files));
	}, [files]);

	/**
	 * 编辑文件名完成时的处理函数
	 * @param name 新文件名
	 * @param prevName 旧文件名
	 */
	const handleEditComplete = (name: string, prevName: string) => {
		updateFileName(prevName, name);
		setSelectedFileName(name);

		setCreating(false);
	};

	/**
	 * 是否正在创建新文件
	 */
	const [creating, setCreating] = useState(false);

	/**
	 * 添加新文件的处理函数
	 */
	const addTab = () => {
		const newFileName = "Comp" + Math.random().toString().slice(2, 6) + ".tsx";
		addFile(newFileName);
		setSelectedFileName(newFileName);
		setCreating(true);
	};

	/**
	 * 删除文件的处理函数
	 * @param name 要删除的文件名
	 */
	const handleRemove = (name: string) => {
		removeFile(name);
		setSelectedFileName(ENTRY_FILE_NAME);
	};

	/**
	 * 不可编辑的文件名列表
	 */
	const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME];

	/**
	 * 渲染文件选项卡列表
	 */
	return (
		<div className={styles.tabs}>
			{/* 文件选项卡 */}
			{tabs.map((item, index, arr) => (
				<FileNameItem
					key={item + index}
					value={item}
					readonly={readonlyFileNames.includes(item)}
					creating={creating && index === arr.length - 1}
					actived={selectedFileName === item}
					onClick={() => setSelectedFileName(item)}
					onEditComplete={(name: string) => handleEditComplete(name, item)}
					onRemove={() => handleRemove(item)}
				></FileNameItem>
			))}
			{/* 添加文件按钮 */}
			<div className={styles.add} onClick={addTab}>
				+
			</div>
		</div>
	);
}
