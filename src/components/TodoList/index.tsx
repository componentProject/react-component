/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-06 14:51:10
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-06 15:06:14
 * @FilePath: \todolist-drag\src\TodoList\index.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { FC } from "react";
import classNames from "classnames";
import { NewItem } from "./NewItem";
import { GarbageBin } from "./GarbageBin";
import { List } from "./List";

export const TodoList: FC = () => {
	return (
		<div className={classNames("w-1000 h-600 m-auto mt-100 p-10", "border-2 border-black", "flex justify-between items-start")}>
			<div className="flex-2 h-full mr-10 overflow-auto">
				<List />
			</div>

			<div className={classNames("flex-1 h-full", "flex flex-col justify-start")}>
				<NewItem />
				<GarbageBin className={"mt-10"} />
			</div>
		</div>
	);
};
