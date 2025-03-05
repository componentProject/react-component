import { createContext } from "react";
/**
 * 从 "@/components/ConfigProvider/types" 中导入 ConfigContextType 类型
 * 该类型用于定义 ConfigContext 的数据结构
 */
import type { ConfigContextType } from "@/components/ConfigProvider/types";

/**
 * 使用 React 的 createContext 函数创建一个 ConfigContext
 * 这个 Context 的默认值是一个空对象，符合 ConfigContextType 类型定义
 * ConfigContext 将用于在 React 组件树中传递配置相关的信息
 */
export const ConfigContext = createContext<ConfigContextType>({});
