/**
 * React相关依赖导入
 */
import { useEffect, useMemo, useState } from "react";
/**
 * React DOM Portal工具导入
 * 用于将组件渲染到DOM树中的不同位置
 */
import { createPortal } from "react-dom";
/**
 * 组件状态存储和组件查询工具导入
 */
import { getComponentById, useComponetsStore } from "@/components/LowCodeEditor/stores/components";
/**
 * Ant Design组件导入
 */
import { Dropdown, Popconfirm, Space } from "antd";
/**
 * Ant Design图标导入
 */
import { DeleteOutlined } from "@ant-design/icons";

/**
 * 选中遮罩组件的属性接口
 * @interface SelectedMaskProps
 */
interface SelectedMaskProps {
	/** Portal容器的类名 */
	portalWrapperClassName: string;
	/** 编辑区容器的类名 */
	containerClassName: string;
	/** 当前选中的组件ID */
	componentId: number;
}

/**
 * 选中遮罩组件
 *
 * 当组件被选中时，显示一个遮罩层来突出显示该组件
 * 并提供组件操作功能，如删除和选择父组件
 *
 * @param {SelectedMaskProps} props - 组件属性
 * @returns {JSX.Element} 渲染的遮罩层
 */
function SelectedMask({ containerClassName, portalWrapperClassName, componentId }: SelectedMaskProps) {
	/**
	 * 遮罩层的位置状态
	 */
	const [position, setPosition] = useState({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		labelTop: 0,
		labelLeft: 0,
	});

	/**
	 * 从组件状态存储中获取组件列表和操作方法
	 */
	const { components, curComponentId, curComponent, deleteComponent, setCurComponentId } = useComponetsStore();

	/**
	 * 当组件ID变化时更新位置
	 */
	useEffect(() => {
		updatePosition();
	}, [componentId]);

	/**
	 * 当组件列表变化时更新位置
	 * 添加延时确保DOM已更新
	 */
	useEffect(() => {
		setTimeout(() => {
			updatePosition();
		}, 200);
	}, [components]);

	/**
	 * 监听窗口大小变化，更新遮罩位置
	 */
	useEffect(() => {
		const resizeHandler = () => {
			updatePosition();
		};
		window.addEventListener("resize", resizeHandler);
		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	/**
	 * 更新遮罩层位置
	 * 根据当前选中组件的DOM位置计算遮罩层的位置
	 */
	function updatePosition() {
		if (!componentId) return;

		const container = document.querySelector(`.${containerClassName}`);
		if (!container) return;

		const node = document.querySelector(`[data-component-id="${componentId}"]`);
		if (!node) return;

		const { top, left, width, height } = node.getBoundingClientRect();
		const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

		let labelTop = top - containerTop + container.scrollTop;
		const labelLeft = left - containerLeft + width;

		if (labelTop <= 0) {
			labelTop -= -20;
		}

		setPosition({
			top: top - containerTop + container.scrollTop,
			left: left - containerLeft + container.scrollTop,
			width,
			height,
			labelTop,
			labelLeft,
		});
	}

	/**
	 * 获取Portal容器元素
	 * 使用useMemo优化性能，避免不必要的DOM查询
	 */
	const el = useMemo(() => {
		const portalElement = document.querySelector(`.${portalWrapperClassName}`);
		if (!portalElement) {
			console.error(`Portal element with class ${portalWrapperClassName} not found`);
			return document.body; // 使用body作为后备
		}
		return portalElement;
	}, [portalWrapperClassName]);

	/**
	 * 获取当前选中的组件对象
	 */
	const curSelectedComponent = useMemo(() => {
		return getComponentById(componentId, components);
	}, [componentId]);

	/**
	 * 处理删除组件的事件
	 * 删除当前选中的组件并清除选中状态
	 */
	function handleDelete() {
		deleteComponent(curComponentId!);
		setCurComponentId(null);
	}

	/**
	 * 获取当前组件的所有父组件列表
	 * 用于在下拉菜单中显示可选择的父组件
	 */
	const parentComponents = useMemo(() => {
		const parentComponents = [];
		let component = curComponent;

		while (component?.parentId) {
			component = getComponentById(component.parentId, components)!;
			parentComponents.push(component);
		}

		return parentComponents;
	}, [curComponent]);

	/**
	 * 通过Portal渲染选中遮罩层和操作菜单
	 */
	return createPortal(
		<>
			{/* 组件选中遮罩 */}
			<div
				style={{
					position: "absolute",
					left: position.left,
					top: position.top,
					backgroundColor: "rgba(0, 0, 255, 0.1)",
					border: "1px dashed blue",
					pointerEvents: "none",
					width: position.width,
					height: position.height,
					zIndex: 12,
					borderRadius: 4,
					boxSizing: "border-box",
				}}
			/>
			{/* 组件操作菜单 */}
			<div
				style={{
					position: "absolute",
					left: position.labelLeft,
					top: position.labelTop,
					fontSize: "14px",
					zIndex: 13,
					display: !position.width || position.width < 10 ? "none" : "inline",
					transform: "translate(-100%, -100%)",
				}}
			>
				<Space>
					{/* 父组件选择下拉菜单 */}
					<Dropdown
						menu={{
							items: parentComponents.map((item) => ({
								key: item.id,
								label: item.desc,
							})),
							onClick: ({ key }) => {
								setCurComponentId(+key);
							},
						}}
						disabled={parentComponents.length === 0}
					>
						<div
							style={{
								padding: "0 8px",
								backgroundColor: "blue",
								borderRadius: 4,
								color: "#fff",
								cursor: "pointer",
								whiteSpace: "nowrap",
							}}
						>
							{curSelectedComponent?.desc}
						</div>
					</Dropdown>
					{/* 组件删除按钮，对根组件不显示 */}
					{curComponentId !== 1 && (
						<div style={{ padding: "0 8px", backgroundColor: "blue" }}>
							<Popconfirm title="确认删除？" okText={"确认"} cancelText={"取消"} onConfirm={handleDelete}>
								<DeleteOutlined style={{ color: "#fff" }} />
							</Popconfirm>
						</div>
					)}
				</Space>
			</div>
		</>,
		el,
	);
}

export default SelectedMask;
