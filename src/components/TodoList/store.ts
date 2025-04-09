/**
 * @file store.ts
 * @description 待办事项列表的状态管理
 */

/**
 * @description 导入 zustand 相关函数
 */
import { StateCreator, create } from "zustand";
/**
 * @description 导入 zustand 的持久化中间件
 */
import { persist } from "zustand/middleware";

/**
 * @interface ListItem
 * @description 待办事项项的数据接口
 * @property {string} id - 待办事项的唯一标识
 * @property {"todo" | "done"} status - 待办事项的状态
 * @property {string} content - 待办事项的内容
 */
export interface ListItem {
	id: string;
	status: "todo" | "done";
	content: string;
}

/**
 * @type State
 * @description 状态接口
 * @property {Array<ListItem>} list - 待办事项列表
 */
type State = {
	list: Array<ListItem>;
};

/**
 * @type Action
 * @description 动作接口
 * @property {Function} addItem - 添加待办事项
 * @property {Function} deleteItem - 删除待办事项
 * @property {Function} updateItem - 更新待办事项
 */
type Action = {
	addItem: (item: ListItem, id?: string) => void;
	deleteItem: (id: string) => void;
	updateItem: (item: ListItem) => void;
};

/**
 * @function stateCreator
 * @description 创建状态和动作
 * @param {Function} set - 设置状态的函数
 * @returns {State & Action} 状态和动作的联合类型
 */
const stateCreator: StateCreator<State & Action> = (set) => ({
	list: [],
	addItem: (item: ListItem, id?: string) => {
		set((state) => {
			if (!id) {
				return {
					list: [...state.list, item],
				};
			}

			const newList = [...state.list];

			const index = newList.findIndex((item) => item.id === id);

			newList.splice(index, 0, item);

			return {
				list: newList,
			};
		});
	},
	deleteItem: (id: string) => {
		set((state) => {
			return {
				list: state.list.filter((item) => {
					return item.id !== id;
				}),
			};
		});
	},
	updateItem: (updateItem: ListItem) => {
		set((state) => {
			return {
				list: state.list.map((item) => {
					if (item.id === updateItem.id) {
						return updateItem;
					}
					return item;
				}),
			};
		});
	},
});

/**
 * @description 创建并导出 store
 */
export const useTodoListStore = create<State & Action>()(
	persist(stateCreator, {
		name: "todolist",
	}),
);
