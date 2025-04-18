/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-01-24 09:45:50
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-17 13:30:50
 * @FilePath: \react-component\.storybook\preview.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import "@/assets/styles/main.css";

const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export const decorators = [
	(Story: any) => (
		<div
			className="flex-col"
			style={{
				maxHeight: "100%",
				overflow: "hidden",
			}}
		>
			{Story()}
		</div>
	),
];

export default preview;
