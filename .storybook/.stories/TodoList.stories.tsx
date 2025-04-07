/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-06 14:49:40
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-06 15:17:18
 * @FilePath: \react-component\.storybook\.stories\TodoList.stories.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { TodoList } from "@/components/TodoList";
import { Meta, StoryFn } from "@storybook/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const meta: Meta<any> = {
	title: "TodoList",
	component: TodoList,
	args: {},
	argTypes: {},
	decorators: [
		(Story) => (
			<DndProvider backend={HTML5Backend}>
				<Story />
			</DndProvider>
		),
	],
};
export default meta;
export const TodoListDemo: StoryFn = (props: any) => <TodoList {...props} />;
const props = {};
TodoListDemo.args = props;
