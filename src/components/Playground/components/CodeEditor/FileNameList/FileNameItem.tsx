/**
 * 导入类名合并工具
 */
import classnames from 'classnames'
/**
 * 导入React和相关钩子
 */
import React, { useState, useRef, useEffect, MouseEventHandler } from 'react'

/**
 * 导入样式
 */
import styles from './index.module.scss'
/**
 * 导入确认弹窗组件
 */
import { Popconfirm } from 'antd'

/**
 * 文件名项组件属性接口
 */
export interface FileNameItemProps {
    value: string
    actived: boolean
    creating: boolean
    readonly: boolean
    onEditComplete: (name: string) => void
    onRemove: () => void
    onClick: () => void
}

/**
 * 文件名项组件
 * 
 * 显示单个文件选项卡，支持重命名和删除操作
 * @param props 组件属性
 * @returns 文件名项组件
 */
export const FileNameItem: React.FC<FileNameItemProps> = (props) => {
  /**
   * 解构组件属性
   */
  const {
    value,
    actived = false,
    readonly,
    creating,
    onClick,
    onRemove,
    onEditComplete,
  } = props

  /**
   * 文件名状态
   */
  const [name, setName] = useState(value);
  /**
   * 是否正在编辑状态
   */
  const [editing, setEditing] = useState(creating)
  /**
   * 输入框引用
   */
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * 双击文件名处理函数
   */
  const handleDoubleClick = () => {
    setEditing(true)
    setTimeout(() => {
      inputRef?.current?.focus()
    }, 0)
  }

  /**
   * 创建新文件时自动聚焦输入框
   */
  useEffect(() => {
    if(creating) {
        inputRef?.current?.focus()
    }
  }, [creating]);

  /**
   * 输入框失焦时处理函数
   */
  const hanldeInputBlur = () => {
    setEditing(false);
    onEditComplete(name);
  }

  /**
   * 渲染文件名项
   */
  return (
    <div
      className={classnames(styles['tab-item'], actived ? styles.actived : null)}
      onClick={onClick}
    >
        {
            editing ? (
                /**
                 * 编辑模式下显示输入框
                 */
                <input
                    ref={inputRef}
                    className={styles['tabs-item-input']}
                    value={name}
                    onBlur={hanldeInputBlur}
                    onChange={(e) => setName(e.target.value)}
                />
            ) : (
                /**
                 * 非编辑模式下显示文件名和删除按钮
                 */
                <>
                    {/* 文件名，非只读时可双击编辑 */}
                    <span onDoubleClick={!readonly ? handleDoubleClick : () => {}}>{name}</span>
                    {
                        !readonly ? (
                            /**
                             * 删除按钮，带确认弹窗
                             */
                            <Popconfirm
                                title="确认删除该文件吗？"
                                okText="确定"
                                cancelText="取消"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    onRemove();
                                }}
                            >
                                {/* 删除图标 */}
                                <span style={{ marginLeft: 5, display: 'flex' }}>
                                    <svg width='12' height='12' viewBox='0 0 24 24'>
                                        <line stroke='#999' x1='18' y1='6' x2='6' y2='18'></line>
                                        <line stroke='#999' x1='6' y1='6' x2='18' y2='18'></line>
                                    </svg>
                                </span>
                            </Popconfirm>
                        ) : null
                    }
                </>
            )
        }
    </div>
  )
}
