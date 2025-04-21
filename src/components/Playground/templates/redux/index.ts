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
export const name = "Redux 模板";

/**
 * 模板描述
 */
export const description = "使用Redux进行状态管理的React应用示例";

/**
 * 创建 Redux 模板
 * @returns 文件集合
 */
export function createTemplate(): Files {
  // 返回文件集合
  return {
    [APP_COMPONENT_FILE_NAME]: {
      name: APP_COMPONENT_FILE_NAME,
      language: fileName2Language(APP_COMPONENT_FILE_NAME),
      value: `import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { increment, decrement, incrementByAmount } from './store';
import './App.css';

export default function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="app">
      <h1>React Redux 计数器</h1>
      
      <div className="card">
        <p className="counter">当前计数: {count}</p>
        
        <div className="button-group">
          <button 
            className="button"
            onClick={() => dispatch(decrement())}
          >
            减少
          </button>
          
          <button 
            className="button primary"
            onClick={() => dispatch(increment())}
          >
            增加
          </button>
        </div>
        
        <button
          className="button secondary"
          onClick={() => dispatch(incrementByAmount(5))}
        >
          增加 5
        </button>
        
        <p className="hint">
          编辑 <code>App.tsx</code> 和 <code>store.ts</code> 来尝试 Redux
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
  background-color: #f7f7f7;
}

.app {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.counter {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0 2rem;
  color: #1677ff;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.button {
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f0f0f0;
  color: #333;
  cursor: pointer;
  transition: all 0.25s;
}

.button:hover {
  background-color: #e0e0e0;
}

.button.primary {
  background-color: #1677ff;
  color: white;
}

.button.primary:hover {
  background-color: #0958d9;
}

.button.secondary {
  background-color: #52c41a;
  color: white;
  margin-top: 1rem;
}

.button.secondary:hover {
  background-color: #389e0d;
}

.hint {
  margin-top: 2rem;
  color: #666;
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
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);`
    },
    "store.ts": {
      name: "store.ts",
      language: "typescript",
      value: `import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义状态接口
interface CounterState {
  value: number;
}

// 初始状态
const initialState: CounterState = {
  value: 0
};

// 创建切片
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // 增加
    increment: (state) => {
      state.value += 1;
    },
    // 减少
    decrement: (state) => {
      state.value -= 1;
    },
    // 增加指定数量
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

// 导出 actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 创建 store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// 导出 RootState 类型
export type RootState = ReturnType<typeof store.getState>;

// 导出 AppDispatch 类型
export type AppDispatch = typeof store.dispatch;`
    },
    [IMPORT_MAP_FILE_NAME]: {
      name: IMPORT_MAP_FILE_NAME,
      language: "json",
      value: `{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0",
    "react-redux": "https://esm.sh/react-redux@8.0.5",
    "@reduxjs/toolkit": "https://esm.sh/@reduxjs/toolkit@1.9.3"
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
  <title>React Redux 示例</title>
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