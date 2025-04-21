/**
 * 导入TypeScript类型获取工具
 */
import { setupTypeAcquisition } from '@typescript/ata'
/**
 * 导入TypeScript编译器
 */
import typescriprt from 'typescript';

/**
 * 创建自动类型获取工具
 * 
 * 用于自动获取代码中引用的外部库的类型定义，提供智能提示
 * @param onDownloadFile 获取到类型定义文件后的回调函数
 * @returns 类型获取函数，接收代码作为参数
 */
export function createATA(onDownloadFile: (code: string, path: string) => void) {
  /**
   * 设置类型获取系统
   */
  const ata = setupTypeAcquisition({
    projectName: 'my-ata',
    typescript: typescriprt,
    logger: console,
    delegate: {
      /**
       * 接收到类型定义文件时的回调
       */
      receivedFile: (code, path) => {
        console.log('自动下载的包', path);
        onDownloadFile(code, path);
      }
    },
  })

  return ata;
}
