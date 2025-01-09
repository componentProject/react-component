import Watermark from "../index.tsx";
import type { StoryFn } from "@storybook/react";
import "./Watermark.css";

/**
 * 水印组件
 */
const meta = {
	title: "水印",
	component: Watermark,
	args: {},
	argTypes: {},
};
export default meta;

const Template: StoryFn = (props) => {
	return (
		<Watermark {...props}>
			<div style={{ height: 800 }}>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt
					asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt
					asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt
					asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt
					asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt
					asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt
					asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt
					asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!
				</p>
			</div>
		</Watermark>
	);
};

export const watermark = Template.bind({});
watermark.args = {
	content: ["测试水印", "小汪的水印"],
	gap: [20, 0],
	// offset: [50, 100],
	// fontStyle: {
	// 	color: 'green'
	// }
};
