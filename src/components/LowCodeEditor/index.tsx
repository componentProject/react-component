/**
 * 导入布局组件
 */
import { Allotment } from "allotment";
/**
 * 导入布局组件样式
 */
import "allotment/dist/style.css";
/**
 * 导入头部组件
 */
import { Header } from "@/components/LowCodeEditor/components/Header";
/**
 * 导入编辑区域组件
 */
import { EditArea } from "@/components/LowCodeEditor/components/EditArea";
/**
 * 导入设置面板组件
 */
import { Setting } from "@/components/LowCodeEditor/components/Setting";
/**
 * 导入物料包装组件
 */
import { MaterialWrapper } from "@/components/LowCodeEditor/components/MaterialWrapper";
/**
 * 导入组件状态管理
 */
import { useComponetsStore } from "@/components/LowCodeEditor/stores/components";
/**
 * 导入预览组件
 */
import { Preview } from "@/components/LowCodeEditor/components/Preivew";

/**
 * 低代码编辑器主组件
 *
 * 提供布局和模式切换功能，包含物料面板、编辑区和属性设置面板
 * 支持编辑模式和预览模式的切换
 *
 * @returns {JSX.Element} 低代码编辑器界面
 */
export default function ReactPlayground() {
	/**
	 * 获取当前编辑器模式
	 */
	const { mode } = useComponetsStore();

	/**
	 * 渲染编辑器界面
	 */
	return (
		<div className="h-[100vh] flex flex-col">
			{/* 头部导航栏 */}
			<div className="h-[60px] flex items-center border-b-[1px] border-[#000]">
				<Header />
			</div>
			{mode === "edit" ? (
				<Allotment>
					{/* 物料面板区域 */}
					<Allotment.Pane preferredSize={240} maxSize={400} minSize={200}>
						<MaterialWrapper />
					</Allotment.Pane>
					{/* 中间编辑区域 */}
					<Allotment.Pane>
						<EditArea />
					</Allotment.Pane>
					{/* 右侧属性设置区域 */}
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
