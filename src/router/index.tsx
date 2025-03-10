import { lazy } from "react";
import type { ComponentType } from "react";
import { Navigate } from "react-router";
import type { RouteObject } from "react-router";

const componentFiles = import.meta.glob("../components/**/index.tsx");
const routes: RouteObject[] = Object.keys(componentFiles).reduce((modules = [], modulePath) => {
	const name = modulePath.split("/").at(-2);
	const component = componentFiles[modulePath] as () => Promise<{ default: ComponentType<any> }>;
	if (!component) return modules;
	const Component = lazy(component);
	modules.push({
		path: `/${name}`,
		element: <Component />,
	});
	return modules;
}, [] as RouteObject[]);

if (routes[0].path) {
	routes.push({
		path: "*",
		element: <Navigate to={routes[0].path} replace />,
	});
}
export default routes;
