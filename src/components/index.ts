let components: any;
try {
	const componentFiles = import.meta.glob(["./**/index.tsx", "!./**/components/*"], { eager: true });
	components = Object.keys(componentFiles).reduce((pre, templateFile) => {
		const module = componentFiles[templateFile];
		const name = templateFile.split("/").at(-2);
		return {
			...pre,
			[name as string]: module,
		};
	}, {} as any);
} catch (e) {
	console.error(e);
	components = {};
}
export default components;
export { default as NewLowCodeEditor } from "./NewLowCodeEditor";
