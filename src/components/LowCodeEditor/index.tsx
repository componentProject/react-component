/**
 * 导入分割面板组件和样式
 */
import { Allotment } from "allotment";
/**
 * 导入分割面板组件样式
 */
import "allotment/dist/style.css";
/**
 * 导入页头组件
 */
import { Header } from "./components/Header";
/**
 * 导入编辑区域组件
 */
import { EditArea } from "./components/EditArea";
/**
 * 导入设置面板组件
 */
import { Setting } from "./components/Setting";
/**
 * 导入物料包装组件
 */
import { MaterialWrapper } from "./components/MaterialWrapper";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "./stores/components";
/**
 * 导入预览组件
 */
import { Preview } from "./components/Preivew";

/**
 * 低代码编辑器主组件
 *
 * 用法: <ReactPlayground />
 *
 * 提供完整的低代码编辑界面，包括物料区、编辑区和属性设置区
 * 支持编辑模式和预览模式的切换
 */
export default function ReactPlayground() {
	/**
	 * 从组件状态存储中获取当前模式
	 */
	const { mode } = useComponetsStore();

	/**
	 * 渲染低代码编辑器界面
	 * 根据模式不同展示不同内容：
	 * - edit模式：显示三栏布局（物料区、编辑区、设置区）
	 * - preview模式：显示预览界面
	 */
	return (
		<div className="h-[100vh] flex flex-col">
			{/* 顶部导航栏 */}
			<div className="h-[60px] flex items-center border-b-[1px] border-[#000]">
				<Header />
			</div>
			{mode === "edit" ? (
				<Allotment>
					{/* 左侧物料区 */}
					<Allotment.Pane preferredSize={240} maxSize={400} minSize={200}>
						<MaterialWrapper />
					</Allotment.Pane>
					{/* 中间编辑区 */}
					<Allotment.Pane>
						<EditArea />
					</Allotment.Pane>
					{/* 右侧设置区 */}
					<Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
						<Setting />
					</Allotment.Pane>
				</Allotment>
			) : (
				<Preview />
			)}
		</div>
	);
}
