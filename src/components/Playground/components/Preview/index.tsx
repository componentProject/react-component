/**
 * 导入React相关钩子
 */
import { useContext, useEffect, useRef, useState, useMemo } from "react";
/**
 * 导入Playground上下文
 */
import { PlaygroundContext } from "@/components/Playground/PlaygroundContext.tsx";

/**
 * 导入预览页面HTML模板
 */
import iframeRaw from "./iframe.html?raw";
/**
 * 导入导入映射文件名常量
 */
import { IMPORT_MAP_FILE_NAME } from "@/components/Playground/files";
/**
 * 导入消息组件
 */
import { Message } from "@/components/Playground/components/Message";
/**
 * 导入编译工作线程
 */
import CompilerWorker from "./compiler.worker?worker";
/**
 * 导入防抖函数
 */
import { debounce } from "lodash-es";

/**
 * 消息数据接口
 */
interface MessageData {
	data: {
		type: string;
		message: string;
	};
}

/**
 * 计算文件内容哈希值用于缓存
 * @param files 文件列表
 * @returns 文件内容哈希
 */
function computeFilesHash(files: Record<string, any>): string {
	const fileEntries = Object.entries(files);
	let hashStr = "";

	for (const [name, file] of fileEntries) {
		if (file.value) {
			hashStr += `${name}:${file.value.length}:${file.value.substring(0, 100)}`;
		}
	}

	// 简单哈希计算
	let hash = 0;
	for (let i = 0; i < hashStr.length; i++) {
		hash = (hash << 5) - hash + hashStr.charCodeAt(i);
		hash |= 0; // 转为32位整数
	}
	return hash.toString(16);
}

/**
 * Preview组件
 *
 * 编译代码并在iframe中预览运行结果
 * 使用方法: <Preview />
 */
export default function Preview() {
	/**
	 * 从上下文中获取文件列表
	 */
	const { files } = useContext(PlaygroundContext);
	/**
	 * 编译后的代码状态
	 */
	const [compiledCode, setCompiledCode] = useState("");
	/**
	 * 错误信息状态
	 */
	const [error, setError] = useState("");
	/**
	 * 编译缓存
	 */
	const compileCacheRef = useRef<Map<string, string>>(new Map());

	/**
	 * 计算当前文件的哈希，用于缓存
	 */
	const filesHash = useMemo(() => computeFilesHash(files), [files]);

	/**
	 * 编译工作线程引用
	 */
	const compilerWorkerRef = useRef<Worker>();

	/**
	 * 初始化编译工作线程
	 */
	useEffect(() => {
		if (!compilerWorkerRef.current) {
			compilerWorkerRef.current = new CompilerWorker();
			compilerWorkerRef.current.addEventListener("message", ({ data }) => {
				if (data.type === "COMPILED_CODE") {
					// 缓存编译结果
					compileCacheRef.current.set(filesHash, data.data);
					setCompiledCode(data.data);
				} else if (data.type === "ERROR") {
					setError(data.error?.message || "编译错误");
				}
			});
		}
	}, [filesHash]);

	/**
	 * 检查缓存并在需要时编译代码
	 */
	useEffect(() => {
		// 先检查缓存
		const cachedCode = compileCacheRef.current.get(filesHash);
		if (cachedCode) {
			console.log("使用缓存代码", filesHash);
			setCompiledCode(cachedCode);
			return;
		}

		// 缓存未命中，进行编译
		const debouncedCompile = debounce(() => {
			console.log("编译代码", filesHash);
			compilerWorkerRef.current?.postMessage(files);
		}, 500);

		debouncedCompile();
		return () => {
			debouncedCompile.cancel();
		};
	}, [files, filesHash]);

	/**
	 * 获取预览iframe的URL
	 * @returns 预览页面的URL
	 */
	const getIframeUrl = () => {
		const res = iframeRaw
			.replace('<script type="importmap"></script>', `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`)
			.replace('<script type="module" id="appSrc"></script>', `<script type="module" id="appSrc">${compiledCode}</script>`);
		return URL.createObjectURL(new Blob([res], { type: "text/html" }));
	};

	/**
	 * 当导入映射或编译代码变化时，更新iframe URL
	 */
	useEffect(() => {
		setIframeUrl(getIframeUrl());
	}, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

	/**
	 * iframe URL状态
	 */
	const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

	/**
	 * 处理来自iframe的消息
	 * @param msg 消息数据
	 */
	const handleMessage = (msg: MessageData) => {
		const { type, message } = msg.data;
		if (type === "ERROR") {
			setError(message);
		}
	};

	/**
	 * 添加和移除消息事件监听器
	 */
	useEffect(() => {
		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	/**
	 * 渲染预览界面
	 */
	return (
		<div style={{ height: "100%" }}>
			{/* 预览iframe */}
			<iframe
				src={iframeUrl}
				style={{
					width: "100%",
					height: "100%",
					padding: 0,
					border: "none",
				}}
			/>
			{/* 错误消息提示 */}
			<Message type="error" content={error} />

			{/* <Editor file={{
            name: 'dist.js',
            value: compiledCode,
            language: 'javascript'
        }}/> */}
		</div>
	);
}
