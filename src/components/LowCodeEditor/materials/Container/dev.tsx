import { useDrag } from 'react-dnd';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef, useState } from 'react';

/**
 * 容器组件开发模式
 * 
 * 可以接受其他组件拖放，同时自身也可被拖拽
 * 
 * @param {CommonComponentProps} props 组件属性
 * @returns {JSX.Element} 渲染的容器组件
 */
const Container = ({ id, name, children, styles }: CommonComponentProps) => {
    /**
     * 拖拽状态
     */
    const [isDragging, setIsDragging] = useState(false);

    /**
     * 使用增强版的拖放钩子
     */
    const { canDrop, isActive, isTargeted, dropRef } = useMaterailDrop(
        ['Button', 'Container', 'Table', 'Form'], 
        id
    );

    /**
     * 配置拖拽功能
     */
    const [_, drag] = useDrag({
        type: name,
        item: () => {
            setIsDragging(true);
            return {
                type: name,
                dragType: 'move',
                id: id
            };
        },
        end: () => {
            setIsDragging(false);
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    /**
     * 根据拖拽状态计算样式类
     */
    const getClassName = () => {
        const baseClass = 'min-h-[100px] p-[20px] transition-all duration-200 relative';
        
        if (isDragging) {
            return `${baseClass} opacity-50 border-[1px] border-gray-400`;
        }
        
        if (isTargeted) {
            return `${baseClass} border-[2px] border-dashed border-blue-500 bg-blue-50`;
        }
        
        if (isActive) {
            return `${baseClass} border-[2px] border-blue-500 bg-blue-50 scale-[1.01]`;
        }
        
        if (canDrop) {
            return `${baseClass} border-[2px] border-blue-400`;
        }
        
        return `${baseClass} border-[1px] border-[#000]`;
    };
    
    // 组合两个引用函数
    const ref = (node: HTMLDivElement) => {
        dropRef(node);
        drag(node);
    };
    
    return (
        <div 
            data-component-id={id}
            ref={ref}
            style={styles}
            className={getClassName()}
        >
            {/* 放置提示 */}
            {isTargeted && (!children || (Array.isArray(children) && children.length === 0)) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-blue-500 opacity-60 text-sm">放置组件到此容器</div>
                </div>
            )}
            {children}
        </div>
    );
};

export default Container;