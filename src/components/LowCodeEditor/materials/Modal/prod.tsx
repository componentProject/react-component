/**
 * 导入Ant Design模态框组件
 */
import { Modal as AntdModal } from "antd";
/**
 * 导入React Hooks和forwardRef
 */
import { forwardRef, useImperativeHandle, useState } from "react";
/**
 * 导入通用组件属性接口
 */
import { CommonComponentProps } from "@/components/LowCodeEditor/interface";

/**
 * 模态框引用接口
 * 定义模态框暴露的方法
 * @interface ModalRef
 */
export interface ModalRef {
	/** 打开模态框方法 */
	open: () => void;
	/** 关闭模态框方法 */
	close: () => void;
}

/**
 * 模态框组件（生产态）
 *
 * 用于预览模式下的模态框组件，支持通过引用调用打开关闭方法
 * 基于Ant Design的Modal组件实现，支持标题、确认和取消事件
 *
 * @param {CommonComponentProps} props - 组件属性
 * @param {React.Ref<ModalRef>} ref - 组件引用
 * @returns {JSX.Element} 模态框组件
 */
const Modal: React.ForwardRefRenderFunction<ModalRef, CommonComponentProps> = (
	{ children, title, onOk, onCancel, styles },
	ref,
) => {
	/**
	 * 模态框显示状态
	 */
	const [open, setOpen] = useState(false);

	/**
	 * 暴露模态框方法给父组件
	 * 提供open和close方法控制模态框的显示和隐藏
	 */
	useImperativeHandle(ref, () => {
		return {
			open: () => {
				setOpen(true);
			},
			close: () => {
				setOpen(false);
			},
		};
	}, []);

	/**
	 * 渲染模态框组件
	 */
	return (
		<AntdModal
			title={title}
			style={styles}
			open={open}
			onCancel={() => {
				onCancel?.();
				setOpen(false);
			}}
			onOk={() => {
				onOk?.();
			}}
			destroyOnClose
		>
			{children}
		</AntdModal>
	);
};

export default forwardRef(Modal);
