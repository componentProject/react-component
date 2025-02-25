import { StoryFn } from "@storybook/react";
import { useState } from "react";
import { Link, useLocation, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useKeepOutLet, KeepAliveLayout } from "@/components/KeepAlive";

/**
 * 基于react-router实现的keepAlive,在storybook中不好展示
 */
const meta = {
	title: "KeepAlive",
	component: undefined,
	args: {},
	argTypes: {
		keepPaths: {
			type: "Array<string | RegExp>",
			description: "需要缓存的路由",
			control: false,
		},
		keepElements: {
			type: "Record<string, ReactNode>",
			description: "需要缓存的 ReactNode",
			control: false,
		},
		dropByPath: {
			type: "(path: string) => void",
			description: "移除缓存的 ReactNode",
			control: false,
		},
	},
};
export default meta;

const Layout = () => {
	const { pathname } = useLocation();
	const element = useKeepOutLet();

	return (
		<div>
			<div>当前路由: {pathname}</div>
			{element}
		</div>
	);
};

const Aaa = () => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<p>{count}</p>
			<p>
				<button onClick={() => setCount((count) => count + 1)}>加一</button>
			</p>
			<Link to="/bbb">去 Bbb 页面</Link>
			<br />
			<Link to="/ccc">去 Ccc 页面</Link>
		</div>
	);
};

const Bbb = () => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<p>{count}</p>
			<p>
				<button onClick={() => setCount((count) => count + 1)}>加一</button>
			</p>
			<Link to="/">去首页</Link>
		</div>
	);
};

const Ccc = () => {
	return (
		<div>
			<p>ccc</p>
			<Link to="/">去首面</Link>
		</div>
	);
};

const routes = [
	{
		path: "/",
		element: <Layout></Layout>,
		children: [
			{
				path: "/",
				element: <Aaa></Aaa>,
			},
			{
				path: "/bbb",
				element: <Bbb></Bbb>,
			},
			{
				path: "/ccc",
				element: <Ccc></Ccc>,
			},
		],
	},
];

const router = createBrowserRouter(routes);

export const KeepAliveDemo: StoryFn = () => {
	return (
		<KeepAliveLayout keepPaths={[/bbb/, "/"]}>
			<RouterProvider router={router} />
		</KeepAliveLayout>
	);
};
