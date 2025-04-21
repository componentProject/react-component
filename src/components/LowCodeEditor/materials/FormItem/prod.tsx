/**
 * 表单项组件（生产态）
 *
 * 在预览模式中作为表单项组件，用于被放置到Form组件中
 * 实际上是一个空组件，因为在Form中会根据FormItem的配置信息渲染实际的表单项
 * 表单项的实际渲染和行为由父Form组件负责处理
 *
 * @returns {JSX.Element} 空的Fragment组件
 */
const FormItem = () => <></>;

export default FormItem;
