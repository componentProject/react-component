import { Table as AntdTable } from 'antd';
import React, { useState, useMemo } from 'react';
import { CommonComponentProps } from '../../interface';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { useDrag } from 'react-dnd';

/**
 * 表格组件开发模式
 * 
 * 可接受表格列组件拖放，同时自身也可被拖拽
 * 
 * @param {CommonComponentProps} props 组件属性
 * @returns {JSX.Element} 渲染的表格组件
 */
function Table({ id, name, children, styles }: CommonComponentProps) {
    // 拖拽状态
    const [isDragging, setIsDragging] = useState(false);

    // 使用增强版的拖放钩子
    const { canDrop, isActive, isTargeted, dropRef } = useMaterailDrop(['TableColumn'], id);
    
    // 配置拖拽功能
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

    // 构建表格列
    const columns = useMemo(() => {
        return React.Children.map(children, (item: any) => {
            return {
                title: <div className='m-[-16px] p-[16px]' data-component-id={item.props?.id}>{item.props?.title}</div>,
                dataIndex: item.props?.dataIndex,
                key: item
            }
        }) || [];
    }, [children]);

    // 组合两个引用函数
    const ref = (node: HTMLDivElement) => {
        dropRef(node);
        drag(node);
    };

    // 根据拖拽状态计算样式类
    const getClassName = () => {
        const baseClass = 'w-[100%] relative transition-all duration-200';
        
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

    return (
        <div
            className={getClassName()}
            ref={ref}
            data-component-id={id}
            style={{
                ...styles,
                opacity: isDragging ? 0.5 : 1
            }}
        >
            {/* 放置提示 */}
            {isTargeted && (!children || (Array.isArray(children) && children.length === 0)) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-blue-500 opacity-60 text-sm">放置表格列到此表格</div>
                </div>
            )}
            <AntdTable
                columns={columns}
                dataSource={[]}
                pagination={false}
            />
        </div>
    );
}

export default Table;