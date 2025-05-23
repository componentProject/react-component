export default {
	hello: "你好`",
	welcome: "欢迎使用i18n资源管理器1",
	save: "保存",
	cancel: "取消",
	inputYourPassword: "请输入您的密码！",
	inputYourUsername: "请输入您的用户名！",
	password: "密码",
	rememberMe: "勿忘我",
	submit: "提交",
	username: "用户名<bbb>｛name｝</bbb>",
	"table.title": "表格标题",
	"table.description": "这是一个表格描述",
	"table.operation": "操作",
	"table.edit": "编辑",
	"table.delete": "删除",
	"table.add": "添加",
	"table.search": "搜索",
	"table.reset": "重置",
	"table.confirm": "确认",
	"table.cancel": "取消",
	"table.success": "操作成功",
	"table.error": "操作失败",
	"table.loading": "加载中...",
	"table.noData": "暂无数据",
	"table.total": "共 {{total}} 条",
	"table.pageSize": "每页 {{size}} 条",
	"table.page": "第 {{page}} 页",
	"table.prev": "上一页",
	"table.next": "下一页",
	"table.jumpTo": "跳至",
	"table.pageSizeChanger": "每页条数",

	// 为 react-intl 添加
	language: "语言",
	"intl.management.title": "国际化资源管理",
	"intl.management.description": "通过此表格可以管理多语言翻译资源，支持编辑、导入、导出功能。",
	"intl.management.save.description": "修改会保存到对应的语言文件中，以便在应用中使用。",
	"intl.button.import.excel": "导入Excel",
	"intl.button.export.excel": "导出Excel",
	"intl.button.save.changes": "保存更改",
	"intl.button.refresh.data": "刷新数据",
	"intl.button.add.item": "添加条目",
	"intl.button.edit": "编辑",
	"intl.button.save": "保存",
	"intl.button.cancel": "取消",
	"intl.table.column.id": "ID",
	"intl.table.column.defaultMessage": "默认文本",
	"intl.table.column.description": "描述",
	"intl.table.column.operation": "操作",
	"intl.table.column.translate.tooltip": "批量翻译 {lang} 列",
	"intl.message.save.success": "已保存所有更改到源代码文件",
	"intl.message.refresh.success": "已重新从源文件加载数据",
	"intl.menu.translate.to": "翻译成 {lang}",
	"intl.message.translate.column.success": "已将 {fromLang} 列翻译成 {toLang}",
	"intl.message.translate.row.success": "已翻译成 {toLang}",
	"intl.message.translate.save.success": "已将翻译保存到服务器",
	"intl.message.translate.failed": "翻译失败",
	"intl.message.translate.no.source": "没有源文本或目标已有翻译",
	"intl.modal.translate.confirm.title": "翻译确认",
	"intl.modal.translate.column.confirm": "确定要将 {fromLang} 列翻译成 {toLang} 吗？这将覆盖 {toLang} 列的现有空白内容。",
	"intl.modal.translate.row.confirm": "确定要将此条目从 {fromLang} 翻译成 {toLang} 吗？",
	"intl.modal.translate.api.select": "选择翻译API",
	"intl.modal.translate.api.baidu": "百度翻译API",
	"intl.modal.translate.api.transformers": "Transformers.js",
	"intl.modal.translate.api.baidu.desc": "使用百度翻译API（需要配置有效的API密钥）",
	"intl.modal.translate.api.transformers.desc": "使用Transformers.js离线翻译（首次使用需要下载模型）",
	"intl.modal.translate.downloading": "正在下载模型...",
	"intl.modal.translate.progress": "正在翻译... ({current}/{total})",
	"intl.modal.translate.button.processing": "处理中...",
	"intl.modal.translate.button.confirm": "确定",
	"intl.modal.translate.button.cancel": "取消",
	"intl.modal.translate.completed": "翻译完成",
	"intl.modal.translate.save.confirm": "是否立即保存更改到服务器？",
	"intl.modal.save.and.close": "保存并关闭",
	"intl.modal.close.only": "仅关闭",
	"intl.modal.translate.warning": "正在翻译中，请等待完成",

	// IntlTable 相关
	"intl.message.update.success": "更新成功",
	"intl.message.save.failed": "保存失败",
	"intl.message.load.failed": "加载数据失败",
	"intl.message.export.failed": "导出Excel失败",
	"intl.message.import.success": "导入成功",
	"intl.message.import.failed": "导入Excel失败",
	"intl.message.save.files.failed": "保存文件失败",
	"intl.excel.sheet.name": "国际化数据",
	"intl.excel.file.name": "国际化数据.xlsx",
	"intl.error.excel.read": "无法读取Excel文件",
	"intl.error.excel.format": "Excel文件格式不正确",
	"intl.error.export.excel": "导出Excel失败",
	"intl.error.import.excel": "导入Excel失败",
	"intl.error.save.files": "保存文件失败",
	"intl.error.unknown.api.type": "未知的翻译API类型",
	"intl.message.transformers.error": "Transformers.js 翻译失败",
	"intl.modal.baidu.api.error.title": "翻译API调用失败",
	"intl.modal.baidu.api.error.content": "百度翻译API调用失败，是否使用Transformers.js进行离线翻译？",
	"intl.modal.baidu.api.error.warning": "注意：首次使用需要下载模型，可能需要一些时间。",
	"intl.modal.baidu.api.error.message": "错误信息: {errorMsg}",
	"intl.modal.baidu.api.error.use.transformers": "使用Transformers.js",
	"intl.modal.baidu.api.error.user.cancel": "用户取消使用Transformers.js翻译",
};
