function changeHtmlClassPrefix(htmlString = "", oldPrefix = "", newPrefix = "") {
	const regex = new RegExp(
		`(class|style)\\s*:\\s*((["']((${oldPrefix}\\b)-).*["'])|((_normalizeClass|_normalizeStyle)\\(.*(${oldPrefix}\\b)-.*\\)))`,
		"g",
	);
	return htmlString.replace(regex, (match = "") => {
		return match.replace(oldPrefix, newPrefix);
	});
}

function changeSelectorPrefix(cssString = "", oldPrefix = "", newPrefix = "") {
	const regex = new RegExp(`(\\.${oldPrefix}\\b|#${oldPrefix}\\b|--${oldPrefix}\\b)`, "g");
	return cssString.replace(regex, (match = "") => {
		return match.replace(oldPrefix, newPrefix);
	});
}

export default function addScopedAndReplacePrefixPlugin({
	prefixScoped = "",
	oldPrefix = "",
	newPrefix = "",
	useDevMode = false,
}) {
	let isProduction: boolean;
	return {
		name: "addScopedAndReplacePrefix",
		configResolved(config: any) {
			isProduction = config.command === "build" || config.isProduction;
		},
		transform(code = "", id = "") {
			if (!isProduction && !useDevMode) return code;
			if (!oldPrefix || !newPrefix) return code;
			if (id.includes("node_modules")) return code;

			const cssLangs = ["css", "scss", "less", "stylus", "styl"];
			let newCode = code;
			if (id.endsWith(".vue")) {
				newCode = changeHtmlClassPrefix(newCode, oldPrefix, newPrefix);
			}
			// else if (id.includes('.vue') && id.includes('scoped')) {
			else if (cssLangs.some((lang) => id.endsWith(`.${lang}`))) {
				if (oldPrefix && newPrefix) {
					newCode = changeSelectorPrefix(newCode, oldPrefix, newPrefix);
				}
				if (prefixScoped) {
					newCode = `${newCode}${prefixScoped}{${newCode}}`;
				}
				return newCode;
			}
			return newCode;
		},
	};
}
