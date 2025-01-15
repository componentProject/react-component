import LazyLoad from "@/components/LazyLoad";
import type { StoryFn } from "@storybook/react";
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
	argTypes: {},
};
export default meta;
const LazyGuang = React.lazy(() => import("./components/Guang"));
const Template: StoryFn = () => {
	return (
		<div>
			{/* <LazyGuang/> */}
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
				<LazyGuang />
			</LazyLoad>
			<LazyLoad
				placeholder={<div>loading...</div>}
				offset={300}
				onContentVisible={() => {
					console.log("img visible");
				}}
			>
				<img src={img2} alt="失败辣" />
			</LazyLoad>
		</div>
	);
};

export const lazyLoad = Template.bind({});
lazyLoad.args = {};
