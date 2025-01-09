import Watermark from "../index.tsx";
import type { StoryFn } from "@storybook/react";

/**
 * 利用父元素会被子元素撑开的特点,将子组件包裹在relative的父元素内,
 * 通过width:calc(100% - ${offsetLeft}); height:calc(100% - ${offsetTop}); position:absolute;将水印画布撑大到与子元素同大小
 *
 * 利用canvas将图片/文字绘制到画布中,并转换为base64,
 *
 * 通过useEffect监视配置变化,重新绘制水印,
 *
 * 通过mutationObserver监视dom元素变化,重新绘制水印
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
