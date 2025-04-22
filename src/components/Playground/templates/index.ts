let templateModules: any;
try {
	const templateFiles = import.meta.glob("./**/index.ts", { eager: true });
	templateModules = Object.keys(templateFiles).reduce((pre, templateFile) => {
		const module = templateFiles[templateFile];
		const name = templateFile.split("/").at(-2);
		return {
			...pre,
			[name as string]: module,
		};
	}, {} as any);
} catch (e) {
	templateModules = {};
	console.error(e);
}
export default templateModules;
