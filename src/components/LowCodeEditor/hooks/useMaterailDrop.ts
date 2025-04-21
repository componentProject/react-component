import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponetsStore } from "../stores/components";
import { useMemo } from "react";

/**
 * 拖拽项类型接口
 * @interface ItemType
 */
export interface ItemType {
  /** 组件类型名称 */
  type: string;
  /** 拖拽类型：移动现有组件或添加新组件 */
  dragType?: 'move' | 'add',
  /** 组件ID */
  id: number
}

/**
 * 使用物料拖放钩子
 * 为目标元素提供拖放区域功能
 * 
 * @param {string[]} accept 可接受的拖拽组件类型列表
 * @param {number} id 目标元素的ID
 * @returns 拖放相关的状态和引用函数
 */
export function useMaterailDrop(accept: string[], id: number) {
    const { addComponent, deleteComponent, components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    // 使用useMemo缓存依赖项，避免不必要的重新创建
    const deps = useMemo(() => ({
      id,
      components,
      componentConfig
    }), [id, components, componentConfig]);

    const [{ canDrop, isOver, isOverCurrent }, dropRef] = useDrop({
        accept,
        drop: (item: ItemType, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) {
              return;
            }

            if(item.dragType === 'move') {
              const component = getComponentById(item.id, components);

              if (component) {
                deleteComponent(item.id);
                addComponent(component, id);
              }
            } else {
              const config = componentConfig[item.type];

              if (config) {
                addComponent({
                  id: new Date().getTime(),
                  name: item.type,
                  desc: config.desc,
                  props: config.defaultProps || {}
                }, id)
              }
            }
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver(),
          isOverCurrent: monitor.isOver({ shallow: true }),
        }),
    }, [deps]);

    // 计算不同的放置状态
    const isActive = canDrop && isOver;
    const isTargeted = isOverCurrent && canDrop;

    return { canDrop, isOver, isActive, isTargeted, dropRef }
}
