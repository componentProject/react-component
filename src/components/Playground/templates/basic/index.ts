/**
 * 导入文件类型
 */
import { Files } from "@/components/Playground/PlaygroundContext.tsx";
/**
 * 导入文件名到语言的转换函数
 */
import { fileName2Language } from "@/components/Playground/utils";
/**
 * 导入常量
 */
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from "@/components/Playground/files";

/**
 * 模板名称
 */
export const name = "基础模板";

/**
 * 模板描述
 */
export const description = "简单的React应用，适合入门学习";

/**
 * 创建基础模板
 * @returns 文件集合
 */
export function createTemplate(): Files {
	// 返回文件集合
	return {
		[APP_COMPONENT_FILE_NAME]: {
			name: APP_COMPONENT_FILE_NAME,
			language: fileName2Language(APP_COMPONENT_FILE_NAME),
			value: `import React, { useState } from 'react';
import './App.css';

export default function App() {
	const [count, setCount] = useState(0);
	
	return (
		<div className="app">
			<h1>React Playground - 基础模板</h1>
			<div className="card">
				<button onClick={() => setCount(count + 1)}>
					计数: {count}
				</button>
				<p>
					编辑 <code>App.tsx</code> 开始您的React学习之旅
				</p>
			</div>
		</div>
	);
}`
		},
		"App.css": {
			name: "App.css",
			language: "css",
			value: `body {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
		'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.app {
	text-align: center;
	max-width: 1280px;
	margin: 0 auto;
	padding: 2rem;
}

h1 {
	font-size: 2.5rem;
	line-height: 1.1;
	margin-bottom: 2rem;
}

.card {
	padding: 2em;
	border-radius: 8px;
	background-color: #f9f9f9;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

button {
	border-radius: 8px;
	border: 1px solid transparent;
	padding: 0.6em 1.2em;
	font-size: 1em;
	font-weight: 500;
	font-family: inherit;
	background-color: #1a1a1a;
	color: white;
	cursor: pointer;
	transition: border-color 0.25s;
	margin-bottom: 1rem;
}

button:hover {
	border-color: #646cff;
}

code {
	font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	background-color: #f1f1f1;
	padding: 2px 4px;
	border-radius: 4px;
}`
		},
		[ENTRY_FILE_NAME]: {
			name: ENTRY_FILE_NAME,
			language: fileName2Language(ENTRY_FILE_NAME),
			value: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);`
		},
		[IMPORT_MAP_FILE_NAME]: {
			name: IMPORT_MAP_FILE_NAME,
			language: "json",
			value: `{
	"imports": {
		"react": "https://esm.sh/react@18.2.0",
		"react-dom/client": "https://esm.sh/react-dom@18.2.0"
	}
}`
		},
		"index.html": {
			name: "index.html",
			language: "html",
			value: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>React Playground</title>
	<script type="importmap" src="./import-map.json"></script>
</head>
<body>
	<div id="root"></div>
	<script type="module" src="./main.tsx"></script>
</body>
</html>`
		}
	};
}
