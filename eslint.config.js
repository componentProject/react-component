import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import storybook from "eslint-plugin-storybook";

export default [
	{
		name: "app/files-to-ignore",
		ignores: [
			"**/servers/**",
			"**/node_modules/**",
			"**/dist/**",
			"**/public/**",
			"**/package-lock.json",
			"**/yarn.lock",
			"**/pnpm-lock.yaml",
			"**/.history/**",
			"**/CHANGELOG*.md",
			"**/*.min.*",
			"**/LICENSE*",
			"**/__snapshots__/**",
			"**/auto-import?(s).d.ts",
			"**/components.d.ts",
		],
		// 其他配置...
	},
	{
		name: "app/files-to-lint",
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		files: ["src/components/*.{ts,mts,tsx,vue}", ".storybook/*.{ts,mts,tsx,vue}"],
	},
	...storybook.configs["flat/recommended"],
	js.configs.recommended,
	...tseslint.configs.recommended,
	// reactRefresh,
	{
		rules: {
			// "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			"react-refresh/only-export-components": "off",
			"react-hooks/exhaustive-deps": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];
