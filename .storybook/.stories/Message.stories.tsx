import { useMessage, ConfigProvider } from "@/components/Message";

const meta = {
	title: "message",
	component: undefined,
	args: {},
	argTypes: {
		add: {
			control: "object",
			type: `(messageProps: {
								style?: CSSProperties;
								className?: string | string[];
								content: ReactNode | string;
								duration?: number;
								onClose?: (...args: any) => void;
								id?: number;
								position?: Position;
							}) => number`,
			description: "message 的 add 方法,返回id",
		},
		remove: {
			control: "function",
			type: "(id: number) => void",
			description: "message 的 remove 方法,通过id移除指定message",
		},
		update: {
			control: "function",
			type: "(id: number, messageProps: MessageProps) => void",
			description: "message 的 update 方法",
		},
		clearAll: {
			control: "function",
			type: "() => void",
			description: "message 的 clearAll 方法,清除所有message",
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
