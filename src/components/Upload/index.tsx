/**
 * @file Upload/index.tsx
 * @description 文件上传组件，支持拖拽上传和普通上传
 */

import { useRef, useState } from "react";
import type { FC, ChangeEvent } from "react";
import axios from "axios";

import "./index.scss";
import UploadList from "./UploadList";
import type { UploadFile } from "./types";
import Dragger from "./Dragger";

import type { propsType } from "./types";

/**
 * @interface UploadProps
 * @description 上传组件的属性接口
 * @property {string} action - 上传地址
 * @property {string} [name] - 上传文件的字段名
 * @property {Record<string, any>} [headers] - 上传请求头
 * @property {Record<string, any>} [data] - 上传额外数据
 * @property {boolean} [withCredentials] - 是否携带cookie
 * @property {string} [accept] - 接受的文件类型
 * @property {boolean} [multiple] - 是否支持多文件上传
 * @property {React.ReactNode} children - 上传触发元素
 * @property {(file: File) => boolean | Promise<boolean>} [beforeUpload] - 上传前钩子
 * @property {(percentage: number, file: File) => void} [onProgress] - 上传进度回调
 * @property {(data: any, file: File) => void} [onSuccess] - 上传成功回调
 * @property {(error: Error, file: File) => void} [onError] - 上传失败回调
 * @property {(file: File) => void} [onChange] - 文件状态改变回调
 * @property {(file: UploadFile) => void} [onRemove] - 文件移除回调
 * @property {boolean} [drag] - 是否支持拖拽上传
 */

/**
 * @component Upload
 * @description 文件上传组件，支持拖拽上传和普通上传，支持文件列表展示,依赖后端服务才能上传文件
 * @param {UploadProps} props - 组件属性
 * @returns {JSX.Element} 上传组件
 */
export const Upload: FC<propsType> = (props) => {
	const {
		action,
		name,
		headers,
		data,
		withCredentials,
		accept,
		multiple,
		children,
		beforeUpload,
		onProgress,
		onSuccess,
		onError,
		onChange,
		onRemove,
		drag,
	} = props;

	const fileInput = useRef<HTMLInputElement>(null);

	const [fileList, setFileList] = useState<Array<UploadFile>>([]);

	const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
		setFileList((prevList) => {
			return prevList.map((file) => {
				if (file.uid === updateFile.uid) {
					return { ...file, ...updateObj };
				} else {
					return file;
				}
			});
		});
	};

	const handleRemove = (file: UploadFile) => {
		setFileList((prevList) => {
			return prevList.filter((item) => item.uid !== file.uid);
		});
		if (onRemove) {
			onRemove(file);
		}
	};

	const handleClick = () => {
		if (fileInput.current) {
			fileInput.current.click();
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) {
			return;
		}
		uploadFiles(files);
		if (fileInput.current) {
			fileInput.current.value = "";
		}
	};

	const uploadFiles = (files: FileList) => {
		const postFiles = Array.from(files);
		postFiles.forEach((file) => {
			if (!beforeUpload) {
				post(file);
			} else {
				const result = beforeUpload(file);
				if (result && result instanceof Promise) {
					result.then((processedFile) => {
						post(processedFile);
					});
				} else if (result) {
					post(file);
				}
			}
		});
	};

	const post = (file: File) => {
		const uploadFile: UploadFile = {
			uid: Date.now() + "upload-file",
			status: "ready",
			name: file.name,
			size: file.size,
			percent: 0,
			raw: file,
		};
		setFileList((prevList) => {
			return [uploadFile, ...prevList];
		});

		const formData = new FormData();

		formData.append(name || "file", file);
		if (data) {
			Object.keys(data).forEach((key) => {
				formData.append(key, data[key]);
			});
		}

		axios
			.post(action, formData, {
				headers: {
					...headers,
					"Content-Type": "multipart/form-data",
				},
				withCredentials,
				onUploadProgress: (e) => {
					const percentage = Math.round((e.loaded * 100) / e.total!) || 0;
					if (percentage < 100) {
						updateFileList(uploadFile, { percent: percentage, status: "uploading" });

						if (onProgress) {
							onProgress(percentage, file);
						}
					}
				},
			})
			.then((resp) => {
				updateFileList(uploadFile, { status: "success", response: resp.data });

				onSuccess?.(resp.data, file);
				onChange?.(file);
			})
			.catch((err) => {
				updateFileList(uploadFile, { status: "error", error: err });

				onError?.(err, file);
				onChange?.(file);
			});
	};

	return (
		<div className="upload-component">
			<div className="upload-input" onClick={handleClick}>
				{drag ? (
					<Dragger
						onFile={(files) => {
							uploadFiles(files);
						}}
					>
						{children}
					</Dragger>
				) : (
					children
				)}
				<input
					className="upload-file-input"
					type="file"
					ref={fileInput}
					onChange={handleFileChange}
					accept={accept}
					multiple={multiple}
				/>
			</div>

			<UploadList fileList={fileList} onRemove={handleRemove} />
		</div>
	);
};

export default Upload;
