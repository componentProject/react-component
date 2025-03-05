import type { FC } from "react";
import type { UploadListProps } from "./types";
import { Progress } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";

/**
 * UploadList组件
 *
 * 该组件用来显示上传文件的列表
 * 该组件的props包括fileList和onRemove两个字段
 *  fileList: 上传文件的列表
 *  onRemove: 删除文件时的钩子函数
 *
 * 该组件会根据fileList的每个item的status来显示不同的状态
 *  ready: 未上传，显示 LoadingOutlined 图标
 *  uploading: 上传中，显示 Progress 组件
 *  success: 上传成功，显示 CheckOutlined 图标
 *  error: 上传失败，显示 CloseOutlined 图标
 *
 * 该组件还提供了一个file-actions的span元素，用于显示删除图标
 *  当点击删除图标时，会调用onRemove钩子函数，并传入当前item
 */
export const UploadList: FC<UploadListProps> = (props) => {
	const { fileList, onRemove } = props;

	return (
		<ul className="upload-list">
			{fileList.map((item) => {
				return (
					<li className={`upload-list-item upload-list-item-${item.status}`} key={item.uid}>
						<span className="file-name">
							{(item.status === "uploading" || item.status === "ready") && <LoadingOutlined />}
							{item.status === "success" && <CheckOutlined />}
							{item.status === "error" && <CloseOutlined />}
							{item.name}
						</span>
						<span className="file-actions">
							<DeleteOutlined
								onClick={() => {
									onRemove(item);
								}}
							/>
						</span>
						{item.status === "uploading" && <Progress percent={item.percent || 0} />}
					</li>
				);
			})}
		</ul>
	);
};

export default UploadList;
