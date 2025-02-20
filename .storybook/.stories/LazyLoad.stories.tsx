import LazyLoad from "@/components/LazyLoad";
import type { MyLazyloadProps } from "@/components/LazyLoad/types";
import React from "react";
import img1 from "./assets/images/img1.png";
import img2 from "./assets/images/img2.png";

/**
 *
 */
const meta = {
	title: "懒加载",
	component: LazyLoad,
	args: {},
	argTypes: {
		className: {
			control: "text",
			type: "string",
			description: "自定义class",
		},
		style: {
			control: "object",
			type: "CSSProperties",
			description: "自定义style",
		},
		placeholder: {
			control: "text",
			type: "ReactNode",
			description: "占位符",
		},
		offset: {
			control: "number",
			type: "string | number",
			description: "偏移量",
		},
		width: {
			control: "number",
			type: "number | string",
			description: "宽度",
		},
		height: {
			control: "number",
			type: "string | number",
			description: "高度",
		},
		onContentVisible: {
			control: "function",
			type: "() => void",
			description: "内容可见时的回调",
		},
		children: {
			control: "text",
			type: "ReactNode",
			description: "懒加载的内容",
		},
	},
};
export default meta;
const LazyMomo = React.lazy(() => import("./components/momo"));

export const lazyLoad = (args: MyLazyloadProps) => {
	return (
		<div>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<LazyLoad
				placeholder={<div>loading...</div>}
				onContentVisible={() => {
					console.log("comp visible");
				}}
			>
				<img src={img1} alt="失败辣" />
				<LazyMomo />
			</LazyLoad>
			<LazyLoad
				placeholder={<div>loading...</div>}
				offset={300}
				onContentVisible={() => {
					console.log("img visible");
				}}
				{...args}
			>
				<img src={img2} alt="失败辣" />
			</LazyLoad>
		</div>
	);
};
