import { Button, Checkbox, Input } from "antd";
import { useRef } from "react";

import Form from "@/components/Form";
import type { FormRefApi } from "@/components/Form/types";

const meta = {
	title: "",
	component: undefined,
	args: {},
	argTypes: {
		className: {
			type: "string",
			description: "form的样式类",
			control: {
				type: "text",
			},
		},
		style: {
			type: "object",
			description: "form的style",
			control: {
				type: "object",
			},
		},
		onFinish: {
			type: "(values: Record<string, any>) => void",
			description: "form提交成功的回调",
			control: {
				type: false,
			},
		},
		onFinishFailed: {
			type: "(errors: Record<string, any>) => void",
			description: "form提交失败的回调",
			control: {
				type: false,
			},
		},
		initialValues: {
			type: "Record<string, any>",
			description: "form的初始值",
			control: {
				type: "object",
			},
		},
		getFieldsValue: {
			type: "() => Record<string, any>",
			description: "组件实例方法,获取form的值",
			control: {
				type: false,
			},
		},
		setFieldsValue: {
			type: "(values: Record<string, any>) => void",
			description: "组件实例方法,设置form的值",
			control: {
				type: false,
			},
		},
		children: {
			type: "ReactNode",
			description: "form的子组件",
			control: {
				type: false,
			},
		},
	},
};
export default meta;

export const FormDemo = () => {
	const onFinish = (values: any) => {
		console.log("Success:", values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const form = useRef<FormRefApi>(null);

	return (
		<>
			<Button
				type="primary"
				onClick={() => {
					console.log(form.current?.getFieldsValue());
				}}
			>
				打印表单值
			</Button>

			<Button
				type="primary"
				onClick={() => {
					form.current?.setFieldsValue({
						username: "东东东",
					});
				}}
			>
				设置表单值
			</Button>

			<Form
				ref={form}
				initialValues={{ remember: true, username: "神说要有光" }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
			>
				<Form.Item
					label="Username"
					name="username"
					rules={[
						{ required: true, message: "请输入用户名!" },
						{ max: 6, message: "长度不能大于 6" },
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item label="Password" name="password" rules={[{ required: true, message: "请输入密码!" }]}>
					<Input.TextArea />
				</Form.Item>

				<Form.Item name="remember" valuePropName="checked">
					<Checkbox>记住我</Checkbox>
				</Form.Item>

				<Form.Item>
					<div>
						<Button type="primary" htmlType="submit">
							登录
						</Button>
					</div>
				</Form.Item>
			</Form>
		</>
	);
};
const props = {};
FormDemo.args = props;
