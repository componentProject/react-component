import LazyLoad from "../index.tsx";
import type { StoryFn } from "@storybook/react";
import React from "react";
import img1 from "./img1.png";
import img2 from "./img2.png";
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
const LazyGuang = React.lazy(() => import("./Guang"));
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
				<img src={img1} />
				<LazyGuang />
			</LazyLoad>
			<LazyLoad
				placeholder={<div>loading...</div>}
				offset={300}
				onContentVisible={() => {
					console.log("img visible");
				}}
			>
				<img src={img2} />
			</LazyLoad>
		</div>
	);
};

export const lazyLoad = Template.bind({});
lazyLoad.args = {};
