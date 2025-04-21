import { CommonComponentProps } from "../../interface";
import { useMaterailDrop } from "../../hooks/useMaterailDrop";
import { useRef, useEffect } from "react";

/**
 * 页面组件开发模式
 * 提供拖拽放置区域，可接受多种组件类型
 * 
 * @param {CommonComponentProps} props 组件属性
 * @returns {JSX.Element} 渲染的页面组件
 */
function Page({ id, name, children, styles }: CommonComponentProps) {
    // 使用增强版的物料拖放钩子
    const { canDrop, isActive, isTargeted, dropRef } = useMaterailDrop(['Button', 'Container', 'Modal', 'Table', 'Form'], id);

    // 根据拖拽状态设置视觉样式
    const borderStyle = isTargeted
        ? '2px dashed #1890ff'  // 当前正在拖拽到这个组件上方
        : canDrop 
            ? '2px solid #1890ff'  // 可以放置但还没有拖拽到组件上方
            : 'none';
    
    const backgroundColor = isTargeted
        ? 'rgba(24, 144, 255, 0.1)'
        : 'transparent';

    return (
        <div
            data-component-id={id}
            ref={dropRef}
            className={`p-[20px] h-[100%] box-border transition-all duration-200 relative ${isActive ? 'scale-[1.01]' : ''}`}
            style={{ 
                ...styles, 
                border: borderStyle,
                backgroundColor,
            }}
        >
            {/* 可视化提示 */}
            {isTargeted && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="text-blue-500 text-lg opacity-50">放置组件在这里</div>
                </div>
            )}
            
            {children}
        </div>
    )
}

export default Page;