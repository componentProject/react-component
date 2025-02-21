import { InboxOutlined } from "@ant-design/icons";
// import {Button} from 'antd';
import Upload, { UploadProps } from "@/components/Upload";

const meta = {
	title: "Upload",
	component: null,
	args: {},
	argTypes: {
		action: {
			options: ["/upload", "/upload2"],
			control: "select",
			type: '"/upload" | "/upload2"',
			description: "上传地址",
		},
		headers: {
			control: "object",
			type: "Record<string, any>",
			description: "自定义的请求头",
		},
		name: {
			control: "text",
			type: "string",
			description: "上传的文件名",
		},
		data: {
			control: "object",
			type: "Record<string, any>",
			description: "自定义的数据",
		},
		withCredentials: {
			control: "boolean",
			type: "boolean",
			description: "表示是否带有cookie",
		},
		accept: {
			control: "text",
			type: "string",
			description: "限制上传的文件类型",
		},
		multiple: {
			control: "boolean",
			type: "boolean",
			description: "是否允许多文件上传",
		},
		beforeUpload: {
			control: "function",
			type: "(file: File) => boolean | Promise<File>",
			description: "上传前检查",
		},
		onProgress: {
			control: "function",
			type: "(percentage: number, file: File) => void",
			description: "上传中",
		},
		onSuccess: {
			control: "function",
			type: "(data: any, file: File) => void",
			description: "上传成功",
		},
		onError: {
			control: "function",
			type: "(err: any, file: File) => void",
			description: "上传失败",
		},
		onChange: {
			control: "function",
			type: "(file: File) => void",
			description: "文件改变",
		},
		onRemove: {
			control: "function",
			type: "(file: UploadFile) => void",
			description: "文件被删除",
		},
		drag: {
			control: "boolean",
			type: "boolean",
			description: "是否开启拖拽上传",
		},
	},
};
export default meta;

/**
 * 需要启动本地server中的uploadFile服务
 */
export const upload = (props: UploadProps) => (
	<Upload {...props}>
		{/* <Button icon={<UploadOutlined />}>Click to Upload</Button> */}
		<p>
			<InboxOutlined style={{ fontSize: "50px" }} />
		</p>
		<p>点击或者拖拽文件到此处</p>
	</Upload>
);
const props: UploadProps = {
	drag: true,
	name: "file",
	action: "http://localhost:3333/upload",
	beforeUpload(file) {
		return !file.name.includes("1.image");
	},
	onSuccess(ret) {
		console.log("onSuccess", ret);
	},
	onError(err) {
		console.log("onError", err);
	},
	onProgress(percentage) {
		console.log("onProgress", percentage);
	},
	onChange(file) {
		console.log("onChange", file);
	},
};
upload.args = props;
