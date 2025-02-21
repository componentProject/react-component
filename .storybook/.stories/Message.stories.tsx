import { useMessage, ConfigProvider } from "@/components/Message";

const meta = {
	title: "message",
	component: null,
	args: {},
	argTypes: {
		children: {
			control: false,
		},
	},
};
export default meta;

function Aaa() {
	const message = useMessage();

	return (
		<button
			onClick={() => {
				message.add({
					content: "请求成功",
				});
			}}
		>
			成功
		</button>
	);
}

export const add = () => {
	return (
		<ConfigProvider>
			<div>
				<Aaa></Aaa>
			</div>
		</ConfigProvider>
	);
};
