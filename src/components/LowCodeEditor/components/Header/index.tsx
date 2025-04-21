/**
 * 导入Ant Design组件
 */
import { Button, Space } from "antd";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "../../stores/components";

/**
 * 页头组件
 *
 * 用法: <Header />
 *
 * 显示应用标题和模式切换按钮（编辑/预览）
 */
export function Header() {
	/**
	 * 从组件状态存储中获取模式相关状态和方法
	 */
	const { mode, setMode, setCurComponentId } = useComponetsStore();

	/**
	 * 渲染页头组件，包含标题和操作按钮
	 */
	return (
		<div className="w-[100%] h-[100%]">
			{/* 页头内容容器 */}
			<div className="h-[50px] flex justify-between items-center px-[20px]">
				{/* 应用标题 */}
				<div>低代码编辑器</div>
				{/* 操作按钮区域 */}
				<Space>
					{/* 编辑模式下显示预览按钮 */}
					{mode === "edit" && (
						<Button
							onClick={() => {
								setMode("preview");
								setCurComponentId(null);
							}}
							type="primary"
						>
							预览
						</Button>
					)}
					{/* 预览模式下显示退出预览按钮 */}
					{mode === "preview" && (
						<Button
							onClick={() => {
								setMode("edit");
							}}
							type="primary"
						>
							退出预览
						</Button>
					)}
				</Space>
			</div>
		</div>
	);
}
