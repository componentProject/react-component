import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';

/**
 * 按钮组件开发模式
 * 
 * 可被拖拽移动的按钮组件
 * 
 * @param {CommonComponentProps} props 组件属性
 * @returns {JSX.Element} 渲染的按钮组件
 */
const Button = ({id, type, text, styles}: CommonComponentProps) => {
  // 配置拖拽功能
  const [{ isDragging }, drag] = useDrag({
      type: 'Button',
      item: {
          type: 'Button',
          dragType: 'move',
          id: id
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
  });

  return (
    <AntdButton 
      ref={drag}
      data-component-id={id} 
      type={type} 
      style={{
        ...styles,
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s'
      }}
    >
      {text}
    </AntdButton>
  );
};

export default Button;