import { InboxOutlined } from "@ant-design/icons";
// import {Button} from 'antd';
import Upload, { UploadProps } from "@/components/Upload";

const meta = {
	title: "Upload",
	component: null,
	args: {},
	argTypes: {},
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
