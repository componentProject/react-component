/**
 * 导入类名合并工具
 */
import classnames from 'classnames'
/**
 * 导入React和相关钩子
 */
import React, { useEffect, useState, useMemo } from 'react'

/**
 * 导入样式
 */
import styles from './index.module.scss'

/**
 * 错误消息格式化
 * 将错误消息格式化，提取行号和文件信息
 * @param content 错误消息内容
 * @returns 格式化后的HTML
 */
function formatErrorMessage(content: string): string {
  if (!content) return '';

  // 匹配行号和列号的正则表达式
  const lineColRegex = /(?:at|line)\s+(\d+)(?::(\d+))?/i;
  // 匹配文件名的正则表达式
  const fileNameRegex = /(?:in|at)\s+([A-Za-z0-9_\-/.]+\.(jsx|tsx|js|ts))/i;
  
  // 提取信息
  const lineMatch = content.match(lineColRegex);
  const fileMatch = content.match(fileNameRegex);
  
  let formattedMessage = content;
  
  // 高亮行号和列号
  if (lineMatch) {
    const lineNumber = lineMatch[1];
    const colNumber = lineMatch[2] || '';
    const replacement = colNumber 
      ? `at <span class="error-line-highlight">line ${lineNumber}:${colNumber}</span>` 
      : `at <span class="error-line-highlight">line ${lineNumber}</span>`;
    formattedMessage = formattedMessage.replace(lineColRegex, replacement);
  }
  
  // 高亮文件名
  if (fileMatch) {
    const fileName = fileMatch[1];
    formattedMessage = formattedMessage.replace(
      fileNameRegex, 
      `in <span class="error-file-highlight">${fileName}</span>`
    );
  }
  
  // 包裹代码片段
  const codeRegex = /['`]([^'`]+)['`]/g;
  formattedMessage = formattedMessage.replace(
    codeRegex, 
    (match, code) => `'<code>${code}</code>'`
  );
  
  return formattedMessage;
}

/**
 * 消息组件属性接口
 */
export interface MessageProps {
    type: 'error' | 'warn'
    content: string
}

/**
 * 消息组件
 * 
 * 用于显示错误或警告信息的弹出消息组件
 * @param props 组件属性
 * @returns 消息组件
 */
export const Message: React.FC<MessageProps> = (props) => {
  /**
   * 解构组件属性
   */
  const { type, content } = props
  /**
   * 消息显示状态
   */
  const [visible, setVisible] = useState(false)

  /**
   * 格式化错误消息
   */
  const formattedContent = useMemo(() => {
    return formatErrorMessage(content);
  }, [content]);

  /**
   * 当内容变化时更新可见状态
   */
  useEffect(() => {
    setVisible(!!content)
  }, [content])

  /**
   * 渲染消息组件
   */
  return visible ? (
    <div className={classnames(styles.msg, styles[type])}>
      {/* 消息内容 */}
      <pre dangerouslySetInnerHTML={{ __html: formattedContent }}></pre>
      {/* 关闭按钮 */}
      <button className={styles.dismiss} onClick={() => setVisible(false)}>
        ✕
      </button>
    </div>
  ) : null
}
