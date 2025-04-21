/**
 * 导入分割面板组件
 */
import { Allotment } from "allotment";
/**
 * 导入分割面板样式
 */
import "allotment/dist/style.css";
/**
 * 导入顶部导航栏组件
 */
import Header from "@/components/Playground/components/Header";
/**
 * 导入代码编辑器组件
 */
import CodeEditor from "@/components/Playground/components/CodeEditor";
/**
 * 导入预览组件
 */
import Preview from "@/components/Playground/components/Preview";
/**
 * 导入React钩子
 */
import { useContext } from "react";
/**
 * 导入Playground上下文
 */
import { PlaygroundContext } from "./PlaygroundContext.tsx";

/**
 * 导入样式文件
 */
import "./index.scss";

/**
 * Playground组件
 *
 * 一个在线代码编辑器和预览工具，提供代码编辑和实时预览功能
 * 使用方法: <Playground />
 */
export default function Playground() {
	/**
	 * 从上下文中获取主题
	 */
	const { theme } = useContext(PlaygroundContext);

	/**
	 * 渲染Playground界面，包含顶部导航栏、代码编辑器和预览区域
	 */
	return (
		<div className={theme} style={{ height: "100vh" }}>
			{/* 顶部导航栏 */}
			<Header />
			{/* 分割面板，默认平均分配空间 */}
			<Allotment defaultSizes={[100, 100]}>
				{/* 左侧代码编辑器面板 */}
				<Allotment.Pane minSize={0}>
					<CodeEditor />
				</Allotment.Pane>
				{/* 右侧预览面板 */}
				<Allotment.Pane minSize={0}>
					<Preview />
				</Allotment.Pane>
			</Allotment>
		</div>
	);
}
