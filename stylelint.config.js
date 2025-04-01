export default {
	extends: [
		"stylelint-config-standard",
		"stylelint-config-standard-scss",
		"stylelint-config-standard-less",
		"stylelint-config-tailwindcss",
	],
	rules: {
		// 在这里可以自定义的规则，覆盖默认的规则
		// 禁用 是否应该满足小驼峰 规则
		"selector-class-pattern": null,
		// 禁用 双斜杠注释不应该有空格 规则
		"scss/double-slash-comment-whitespace-inside": null,
		// 禁用 空源文件
		"no-empty-source": null,
		"no-duplicate-selectors": null,
		// 禁用 scss 的 扩展检测
		"scss/load-partial-extension": null,
		// 使 tailwind 可用
		"at-rule-no-unknown": [
			true,
			{
				ignoreAtRules: ["tailwind", "forward", "use", "each"],
			},
		],
		"scss/at-rule-no-unknown": [
			true,
			{
				ignoreAtRules: ["tailwind", "forward", "use", "each"],
			},
		],
	},
};
