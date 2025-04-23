/**
 * 导入Ant Design组件
 */
import { Button, Space } from "antd";
/**
 * 导入React Hooks
 */
import { useState } from "react";
/**
 * 导入组件状态存储
 */
import { useComponetsStore } from "@/components/LowCodeEditor/stores/components";
/**
 * 导入代码生成器对话框
 */
import { CodeGeneratorDialog } from "@/components/LowCodeEditor/components/CodeGenerator";

/**
 * 头部导航组件
 *
 * 负责显示编辑器标题和模式切换按钮，用户可以通过此组件在编辑模式和预览模式间切换
 * 提供代码生成功能入口
 *
 * @returns {JSX.Element} 头部导航栏
 */
export function Header() {
	/**
	 * 从组件状态存储中获取当前模式和模式切换方法
	 */
	const { mode, setMode, setCurComponentId } = useComponetsStore();

	/**
	 * 代码生成器对话框可见性状态
	 */
	const [codeGenVisible, setCodeGenVisible] = useState(false);

	/**
	 * 显示代码生成器对话框
	 */
	const showCodeGenerator = () => {
		setCodeGenVisible(true);
	};

	/**
	 * 隐藏代码生成器对话框
	 */
	const hideCodeGenerator = () => {
		setCodeGenVisible(false);
	};

	/**
	 * 渲染头部导航栏
	 */
	return (
		<div className="w-[100%] h-[100%]">
			{/* 头部内容区域 */}
			<div className="h-[50px] flex justify-between items-center px-[20px]">
				{/* 标题 */}
				<div>低代码编辑器</div>
				{/* 操作按钮区域 */}
				<Space>
					{/* 编辑模式下显示代码生成和预览按钮 */}
					{mode === "edit" && (
						<>
							<Button onClick={showCodeGenerator} type="default">
								生成代码
							</Button>
							<Button
								onClick={() => {
									setMode("preview");
									setCurComponentId(null);
								}}
								type="primary"
							>
								预览
							</Button>
						</>
					)}
					{/* 预览模式下显示退出按钮 */}
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

			{/* 代码生成器对话框 */}
			<CodeGeneratorDialog visible={codeGenVisible} onClose={hideCodeGenerator} />
		</div>
	);
}
