import { Form as AntdForm, Input } from 'antd';
import React, { useState, useMemo } from 'react';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';

/**
 * 表单组件开发模式
 * 
 * 可接受表单项组件拖放，同时自身也可被拖拽
 * 
 * @param {CommonComponentProps} props 组件属性
 * @returns {JSX.Element} 渲染的表单组件
 */
function Form({ id, name, children, onFinish, styles }: CommonComponentProps) {
    // 表单实例
    const [form] = AntdForm.useForm();
    
    // 拖拽状态
    const [isDragging, setIsDragging] = useState(false);

    // 使用增强版的拖放钩子
    const { canDrop, isActive, isTargeted, dropRef } = useMaterailDrop(['FormItem'], id);

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

    // 构建表单项
    const formItems = useMemo(() => {
        return React.Children.map(children, (item: any) => {
            return {
                label: item.props?.label,
                name: item.props?.name,
                type: item.props?.type,
                id: item.props?.id,
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
        const baseClass = 'w-[100%] p-[20px] min-h-[100px] relative transition-all duration-200';
        
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

    return <div
        className={getClassName()}
        ref={ref}
        data-component-id={id}
        style={{
            ...styles,
            opacity: isDragging ? 0.5 : 1
        }}
    >
        {/* 放置提示 */}
        {isTargeted && (!formItems || formItems.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-blue-500 opacity-60 text-sm">放置表单项到此表单</div>
            </div>
        )}
        <AntdForm 
            labelCol={{ span: 6 }} 
            wrapperCol={{ span: 18 }} 
            form={form} 
            onFinish={(values) => {
                onFinish && onFinish(values)
            }}
        >
            {formItems.map((item: any) => {
                return <AntdForm.Item 
                    key={item.name} 
                    data-component-id={item.id} 
                    name={item.name} 
                    label={item.label}
                >
                    <Input style={{pointerEvents: 'none'}}/>
                </AntdForm.Item>
            })}
        </AntdForm>
    </div>
}

export default Form;
