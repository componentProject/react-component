/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-07 17:56:43
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 20:42:17
 * @FilePath: \react-component\src\components\TodoList\index.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * @file index.tsx
 * @description TodoList 组件的入口文件
 */

/**
 * @description 导入 React 的 FC 类型
 */
import { FC } from "react";
/**
 * @description 导入 classNames 工具函数
 */
import classNames from "classnames";
/**
 * @description 导入 NewItem 组件
 */
import { NewItem } from "./NewItem";
/**
 * @description 导入 GarbageBin 组件
 */
import { GarbageBin } from "./GarbageBin";
/**
 * @description 导入 List 组件
 */
import { List } from "./List";

/**
 * @component TodoList
 * @description 这是一个待办事项列表组件，功能是管理待办事项，支持拖拽排序和删除
 */
export const TodoList: FC = () => {
	return (
		<div
			className={classNames(
				"w-full h-300 overflow-auto m-auto mt-100 p-10",
				"border-2 border-black",
				"flex justify-between items-start",
			)}
		>
			{/* 左侧列表区域 */}
			<div className="flex-2 h-full mr-10 overflow-auto">
				<List />
			</div>

			{/* 右侧操作区域 */}
			<div className={classNames("flex-1 h-full", "flex flex-col justify-start")}>
				<NewItem />
				<GarbageBin className={"mt-10"} />
			</div>
		</div>
	);
};
