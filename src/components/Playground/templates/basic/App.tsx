import { useState } from "react";
import "./App.css";

export default function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="app">
			<h1>React Playground</h1>
			<p>点击按钮测试状态更新</p>
			<button onClick={() => setCount(count + 1)}>计数: {count}</button>
		</div>
	);
}
