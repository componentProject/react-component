/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-02-24 09:05:59
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-11 12:38:31
 * @FilePath: \react-component\src\components\Form\index.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * Form 表单组件
 *
 *  Form 是一个表单组件，用于收集、校验和提交表单数据
 *  Form 提供了一个简洁的 API，用于快速构建表单
 *  Form 的主要特点是可以自动收集表单数据，提供了多种方式来校验表单数据
 *  Form 还提供了一个 onSubmit 事件，用于在表单数据提交时执行回调函数
 */
import InternalForm from "./Form";
import Item from "./Item";

/**
 *  Form 的类型
 *
 *  Form 的类型是 InternalFormType
 *  InternalFormType 是一个对象，包含了 Form 的所有 props
 */
type InternalFormType = typeof InternalForm;

/**
 *  FormInterface 是 Form 的一个接口
 *
 *  FormInterface 继承自 InternalFormType
 *  FormInterface 添加了一个 Item 属性，用于表示 Form.Item 组件
 */
interface FormInterface extends InternalFormType {
	/**
	 *  Form.Item 是 Form 的一个组件，用于表示表单项
	 *
	 *  Form.Item 是一个函数组件，用于快速构建表单项
	 *  Form.Item 的 props 是一个对象，包含了 label、name、rules 等多个字段
	 */
	Item: typeof Item;
}

/**
 *  Form 是 InternalForm 的一个别名
 *
 *  Form 是一个对象，包含了 InternalForm 的所有 props
 *  Form 的类型是 FormInterface
 */
const Form = InternalForm as FormInterface;

/**
 *  Form.Item 是 Form 的一个组件，用于表示表单项
 *
 *  Form.Item 是一个函数组件，用于快速构建表单项
 *  Form.Item 的 props 是一个对象，包含了 label、name、rules 等多个字段
 */
Form.Item = Item;

/**
 *  export default Form
 *
 *  export default Form 是将 Form 导出为 default exports
 *  这样可以在其他组件中使用 Form
 */
export default Form;
