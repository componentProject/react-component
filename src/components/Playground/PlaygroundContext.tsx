/**
 * 导入React相关钩子和类型
 */
import { PropsWithChildren, createContext, useEffect, useState } from "react";
/**
 * 导入工具函数
 */
import { compress, fileName2Language, uncompress } from "./utils";
/**
 * 导入初始文件
 */
import { initFiles, initializeApp, APP_COMPONENT_FILE_NAME } from "./files";

/**
 * 快照接口定义
 */
export interface Snapshot {
	id: string;
	name: string;
	files: Files;
	createdAt: number;
}

/**
 * 文件接口定义
 */
export interface File {
	name: string;
	value: string;
	language: string;
}

/**
 * 文件列表接口定义
 */
export interface Files {
	[key: string]: File;
}

/**
 * Playground上下文接口定义
 */
export interface PlaygroundContext {
	files: Files;
	selectedFileName: string;
	theme: Theme;
	loading: boolean;
	snapshots: Snapshot[];
	setTheme: (theme: Theme) => void;
	setSelectedFileName: (fileName: string) => void;
	setFiles: (files: Files) => void;
	addFile: (fileName: string) => void;
	removeFile: (fileName: string) => void;
	updateFileName: (oldFieldName: string, newFieldName: string) => void;
	createSnapshot: (name: string) => void;
	loadSnapshot: (id: string) => void;
	deleteSnapshot: (id: string) => void;
}

/**
 * 主题类型定义
 */
export type Theme = "light" | "dark";

// 存储快照的localStorage键名
const SNAPSHOTS_STORAGE_KEY = "playground_snapshots";

/**
 * 创建Playground上下文
 */
export const PlaygroundContext = createContext<PlaygroundContext>({
	files: {},
	selectedFileName: APP_COMPONENT_FILE_NAME,
	theme: "light",
	loading: false,
	snapshots: [],
	setTheme: () => {},
	setSelectedFileName: () => {},
	setFiles: () => {},
	addFile: () => {},
	removeFile: () => {},
	updateFileName: () => {},
	createSnapshot: () => {},
	loadSnapshot: () => {},
	deleteSnapshot: () => {},
});

/**
 * 从URL哈希中获取文件列表
 * @returns 解析后的文件列表或undefined
 */
const getFilesFromUrl = () => {
	let files: Files | undefined;
	try {
		const hash = uncompress(window.location.hash.slice(1));
		files = JSON.parse(hash);
	} catch (error) {
		console.error(error);
	}
	return files;
};

/**
 * 从localStorage获取快照列表
 * @returns 快照列表
 */
const getSnapshots = (): Snapshot[] => {
	try {
		const snapshots = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
		return snapshots ? JSON.parse(snapshots) : [];
	} catch (error) {
		console.error('读取快照失败:', error);
		return [];
	}
};

/**
 * 保存快照列表到localStorage
 * @param snapshots 快照列表
 */
const saveSnapshots = (snapshots: Snapshot[]) => {
	try {
		localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots));
	} catch (error) {
		console.error('保存快照失败:', error);
	}
};

/**
 * Playground提供者组件
 * 
 * 为应用提供Playground上下文，管理文件、选中文件和主题等状态
 * @param props 子组件
 */
export const PlaygroundProvider = (props: PropsWithChildren) => {
	/**
	 * 解构子组件
	 */
	const { children } = props;
	/**
	 * 文件列表状态
	 */
	const urlFiles = getFilesFromUrl();
	const [files, setFiles] = useState<Files>(urlFiles && Object.keys(urlFiles).length > 0 ? urlFiles : {...initFiles});
	/**
	 * 当前选中文件名状态
	 */
	const [selectedFileName, setSelectedFileName] = useState(APP_COMPONENT_FILE_NAME);
	/**
	 * 主题状态
	 */
	const [theme, setTheme] = useState<Theme>("light");
	/**
	 * 加载状态
	 */
	const [loading, setLoading] = useState(false);
	/**
	 * 快照列表状态
	 */
	const [snapshots, setSnapshots] = useState<Snapshot[]>(getSnapshots());

	/**
	 * 初始化应用
	 */
	useEffect(() => {
		const initialize = async () => {
			setLoading(true);
			try {
				await initializeApp();
				// 如果URL中没有文件，重新设置为初始文件
				if (Object.keys(files).length === 0) {
					console.log('从初始模板加载文件');
					setFiles({...initFiles});
				}
				
				// 确保选中的文件存在
				if (!files[selectedFileName]) {
					const firstFileName = Object.keys(files)[0] || "App.tsx";
					console.log(`选中的文件 ${selectedFileName} 不存在，切换到 ${firstFileName}`);
					setSelectedFileName(firstFileName);
				}
			} catch (error) {
				console.error('初始化应用失败:', error);
				// 确保即使失败也有初始文件
				if (Object.keys(files).length === 0) {
					setFiles({...initFiles});
				}
			} finally {
				setLoading(false);
			}
		};
		
		initialize();
	}, []);

	/**
	 * 添加文件方法
	 * @param name 文件名
	 */
	const addFile = (name: string) => {
		files[name] = {
			name,
			language: fileName2Language(name),
			value: "",
		};
		setFiles({ ...files });
	};

	/**
	 * 删除文件方法
	 * @param name 文件名
	 */
	const removeFile = (name: string) => {
		delete files[name];
		setFiles({ ...files });
	};

	/**
	 * 更新文件名方法
	 * @param oldFieldName 旧文件名
	 * @param newFieldName 新文件名
	 */
	const updateFileName = (oldFieldName: string, newFieldName: string) => {
		if (!files[oldFieldName] || newFieldName === undefined || newFieldName === null) return;
		const { [oldFieldName]: value, ...rest } = files;
		const newFile = {
			[newFieldName]: {
				...value,
				language: fileName2Language(newFieldName),
				name: newFieldName,
			},
		};
		setFiles({
			...rest,
			...newFile,
		});
	};

	/**
	 * 创建快照方法
	 * @param name 快照名称
	 */
	const createSnapshot = (name: string) => {
		if (!name.trim()) return;
		
		const newSnapshot: Snapshot = {
			id: Date.now().toString(),
			name,
			files: { ...files },
			createdAt: Date.now()
		};
		
		const updatedSnapshots = [...snapshots, newSnapshot];
		setSnapshots(updatedSnapshots);
		saveSnapshots(updatedSnapshots);
	};

	/**
	 * 加载快照方法
	 * @param id 快照ID
	 */
	const loadSnapshot = (id: string) => {
		const snapshot = snapshots.find(s => s.id === id);
		if (snapshot) {
			setFiles({ ...snapshot.files });
			setSelectedFileName(Object.keys(snapshot.files)[0] || "App.tsx");
		}
	};

	/**
	 * 删除快照方法
	 * @param id 快照ID
	 */
	const deleteSnapshot = (id: string) => {
		const updatedSnapshots = snapshots.filter(s => s.id !== id);
		setSnapshots(updatedSnapshots);
		saveSnapshots(updatedSnapshots);
	};

	/**
	 * 当文件变化时，将文件列表保存到URL哈希
	 */
	useEffect(() => {
		const hash = compress(JSON.stringify(files));
		window.location.hash = hash;
	}, [files]);

	/**
	 * 返回上下文提供者
	 */
	return (
		<PlaygroundContext.Provider
			value={{
				theme,
				setTheme,
				files,
				selectedFileName,
				setSelectedFileName,
				setFiles,
				addFile,
				removeFile,
				updateFileName,
				loading,
				snapshots,
				createSnapshot,
				loadSnapshot,
				deleteSnapshot
			}}
		>
			{children}
		</PlaygroundContext.Provider>
	);
};

/**
 * PlaygroundProvider组件默认导出
 * 
 * 使用方法: <PlaygroundProvider>子组件</PlaygroundProvider>
 */
export default PlaygroundProvider;
