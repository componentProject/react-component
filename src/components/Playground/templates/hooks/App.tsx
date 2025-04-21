import { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";

interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

export default function App() {
	// State hooks
	const [todos, setTodos] = useState<Todo[]>([]);
	const [input, setInput] = useState("");
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

	// Effect hook - 模拟加载初始数据
	useEffect(() => {
		const initialTodos = [
			{ id: 1, text: "学习 React Hooks", completed: true },
			{ id: 2, text: "创建一个 Todo 应用", completed: false },
			{ id: 3, text: "优化性能", completed: false },
		];
		setTodos(initialTodos);
	}, []);

	// Callback hook - 添加新任务
	const addTodo = useCallback(() => {
		if (input.trim()) {
			setTodos((prev) => [
				...prev,
				{
					id: Date.now(),
					text: input,
					completed: false,
				},
			]);
			setInput("");
		}
	}, [input]);

	// Callback hook - 切换任务状态
	const toggleTodo = useCallback((id: number) => {
		setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
	}, []);

	// Callback hook - 删除任务
	const deleteTodo = useCallback((id: number) => {
		setTodos((prev) => prev.filter((todo) => todo.id !== id));
	}, []);

	// Memo hook - 根据筛选条件过滤任务
	const filteredTodos = useMemo(() => {
		switch (filter) {
			case "active":
				return todos.filter((todo) => !todo.completed);
			case "completed":
				return todos.filter((todo) => todo.completed);
			default:
				return todos;
		}
	}, [todos, filter]);

	// Memo hook - 计算完成任务的数量
	const completedCount = useMemo(() => {
		return todos.filter((todo) => todo.completed).length;
	}, [todos]);

	return (
		<div className="app">
			<h1>React Hooks Todo</h1>

			<div className="add-todo">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && addTodo()}
					placeholder="添加新任务..."
				/>
				<button onClick={addTodo}>添加</button>
			</div>

			<div className="filters">
				<button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
					全部
				</button>
				<button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>
					未完成
				</button>
				<button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>
					已完成
				</button>
			</div>

			<ul className="todo-list">
				{filteredTodos.map((todo) => (
					<li key={todo.id} className={todo.completed ? "completed" : ""}>
						<span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
						<button onClick={() => deleteTodo(todo.id)}>删除</button>
					</li>
				))}
			</ul>

			<div className="todo-stats">
				完成: {completedCount} / {todos.length}
			</div>
		</div>
	);
}
