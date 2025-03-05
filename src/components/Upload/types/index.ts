import type { PropsWithChildren } from "react";

/**
 *  Upload组件的props类型
 *
 *  该组件的props可以分为三大类：
 *    1. 与文件上传相关的props，包括action, headers, name, data, withCredentials, accept, multiple
 *    2. 钩子函数props，包括beforeUpload, onProgress, onSuccess, onError, onChange, onRemove
 *    3. drag props，用于控制是否开启拖拽上传
 */
export interface propsType extends PropsWithChildren {
	/**
	 *  上传文件的地址
	 */
	action: string;
	/**
	 *  上传文件时的headers
	 */
	headers?: Record<string, any>;
	/**
	 *  上传文件的name
	 */
	name?: string;
	/**
	 *  上传文件时的data
	 */
	data?: Record<string, any>;
	/**
	 *  上传文件时是否带cookie
	 */
	withCredentials?: boolean;
	/**
	 *  上传文件的accept
	 */
	accept?: string;
	/**
	 *  是否允许上传多个文件
	 */
	multiple?: boolean;
	/**
	 *  上传文件前的钩子函数
	 *  该函数返回false时，上传文件将被中断
	 */
	beforeUpload?: (file: File) => boolean | Promise<File>;
	/**
	 *  上传文件过程中的钩子函数
	 *  该函数将在上传文件时不断被调用，直到上传完成
	 */
	onProgress?: (percentage: number, file: File) => void;
	/**
	 *  上传文件成功后的钩子函数
	 */
	onSuccess?: (data: any, file: File) => void;
	/**
	 *  上传文件失败后的钩子函数
	 */
	onError?: (err: any, file: File) => void;
	/**
	 *  上传文件的状态发生变化时的钩子函数
	 */
	onChange?: (file: File) => void;
	/**
	 *  删除文件时的钩子函数
	 */
	onRemove?: (file: UploadFile) => void;
	/**
	 *  是否开启拖拽上传
	 */
	drag: boolean;
}

/**
 *  上传文件的类型
 *
 *  该类型包括uid, size, name, status, percent, raw, response, error八个字段
 *  uid: 文件的唯一标识
 *  size: 文件的大小
 *  name: 文件的名称
 *  status: 文件的状态，包括ready, uploading, success, error四种状态
 *  percent: 文件的上传进度
 *  raw: 文件的原生File对象
 *  response: 上传文件后的响应数据
 *  error: 上传文件时的错误信息
 */
export interface UploadFile {
	uid: string;
	size: number;
	name: string;
	status?: "ready" | "uploading" | "success" | "error";
	percent?: number;
	raw?: File;
	response?: any;
	error?: any;
}

/**
 *  UploadList组件的props类型
 *
 *  该组件的props包括fileList和onRemove两个字段
 *  fileList: 上传文件的列表
 *  onRemove: 删除文件时的钩子函数
 */
export interface UploadListProps {
	fileList: UploadFile[];
	onRemove: (file: UploadFile) => void;
}

/**
 *  Dragger组件的props类型
 *
 *  该组件的props包括onFile一个字段
 *  onFile: 选择文件时的钩子函数
 */
export interface DraggerProps extends PropsWithChildren {
	onFile: (files: FileList) => void;
}
