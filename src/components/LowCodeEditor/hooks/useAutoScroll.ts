import { useEffect } from 'react';

/**
 * 自动滚动配置选项
 * @interface AutoScrollOptions
 */
interface AutoScrollOptions {
  /** 滚动时的速度因子，默认为10 */
  speed?: number;
  /** 触发滚动的边缘距离，默认为50px */
  edgeThreshold?: number;
}

/**
 * 拖拽自动滚动钩子
 * 
 * 当拖拽元素接近容器边缘时自动滚动容器
 * 
 * @param containerSelector 容器元素的CSS选择器
 * @param isDragging 是否正在拖拽的状态
 * @param options 自动滚动配置选项
 */
export function useAutoScroll(
  containerSelector: string,
  isDragging: boolean,
  options: AutoScrollOptions = {}
) {
  const { speed = 10, edgeThreshold = 50 } = options;

  useEffect(() => {
    if (!isDragging) return;

    let animationFrameId: number;
    let container: HTMLElement | null = null;

    // 获取容器元素
    container = document.querySelector(containerSelector);
    if (!container) return;

    /**
     * 检查鼠标位置并滚动容器
     * @param e 鼠标事件
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;

      // 获取容器和鼠标位置
      const containerRect = container.getBoundingClientRect();
      const mouseY = e.clientY;

      // 计算鼠标与容器边缘的距离
      const distanceFromTop = mouseY - containerRect.top;
      const distanceFromBottom = containerRect.bottom - mouseY;

      // 计算滚动速度和方向
      let scrollSpeed = 0;

      if (distanceFromTop < edgeThreshold) {
        // 顶部边缘，向上滚动
        scrollSpeed = -speed * (1 - distanceFromTop / edgeThreshold);
      } else if (distanceFromBottom < edgeThreshold) {
        // 底部边缘，向下滚动
        scrollSpeed = speed * (1 - distanceFromBottom / edgeThreshold);
      }

      // 如果需要滚动，应用滚动
      if (scrollSpeed !== 0) {
        // 使用 requestAnimationFrame 平滑滚动
        const scroll = () => {
          if (container) {
            container.scrollTop += scrollSpeed;
            animationFrameId = requestAnimationFrame(scroll);
          }
        };
        
        // 启动滚动动画
        animationFrameId = requestAnimationFrame(scroll);
      } else if (animationFrameId) {
        // 如果不需要滚动，取消动画
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    // 监听鼠标移动事件
    document.addEventListener('mousemove', handleMouseMove);

    // 清理函数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [containerSelector, isDragging, speed, edgeThreshold]);
} 