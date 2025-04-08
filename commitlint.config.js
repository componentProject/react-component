// export default {
//   extends: ['@commitlint/config-conventional'],
// }

export default {
	ignores: [(commit) => commit.includes("init")],
	extends: ["@commitlint/config-conventional"],
	rules: {
		"commit-message-rule": [2, "always"],
	},
	plugins: [
		{
			rules: {
				"commit-message-rule": ({ header }) => {
					// 匹配 <type>(<scope>): <short description>
					// 注意：这里简化了校验，只要求 type 和 short description 存在
					const typeList = "build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test";
					const AngularCommitReg = new RegExp(`^(<${typeList}>(?:\\([a-zA-Z0-9_-]+\\))?):\\s.+$`);
					// feat     新增功能，迭代项目需求
					// refactor 重构代码，非新增功能也非修复缺陷
					// perf     优化相关，比如提升性能、体验
					// test     新增测试，追加测试用例验证代码
					// style    代码格式修改, 注意不是 css 修改
					// fix      修复缺陷
					// revert   回滚版本，撤销某次代码提交
					// merge    合并分支，合并分支代码到其他分支
					// docs     更新文档，仅修改文档不修改代码
					// build    编译相关的修改，例如发布版本、对项目构建或者依赖的改动
					// chore    其他修改, 比如改变构建流程、或者增加依赖库、工具等
					// ci       更新脚本，改动CI或执行脚本配置
					// 如果头部匹配 Angular 提交规范，返回 true 和空字符串；否则返回 false 和错误信息
					return [
						AngularCommitReg.test(header),
						"您的提交信息不符合规范！正确的格式为(示例)：\n" +
							"            'feat: 新增功能，迭代项目需求',\n" +
							"            'style: 代码格式修改, 注意不是 css 修改',\n" +
							"            'perf: 优化相关，比如提升性能、体验',\n" +
							"            'fix: 修复缺陷',\n" +
							"            'refactor: 重构代码，非新增功能也非修复缺陷',\n" +
							"            'test: 新增测试，追加测试用例验证代码',\n" +
							"            'revert: 回滚版本，撤销某次代码提交',\n" +
							"            'merge: 合并分支，合并分支代码到其他分支',\n" +
							"            'docs: 更新文档，仅修改文档不修改代码',\n" +
							"            'build: 编译相关的修改，例如发布版本、对项目构建或者依赖的改动',\n" +
							"            'chore: 其他修改, 比如改变构建流程、或者增加依赖库、工具等',\n" +
							"            'ci: 更新脚本，改动CI或执行脚本配置',",
					];
				},
			},
		},
	],
};
