import { lazy } from "react";
// import {Navigate} from "react-router-dom";
import { Navigate } from "react-router";

const componentFiles = import.meta.glob("../components/**/index.tsx");
const routes = Object.keys(componentFiles).reduce((modules = [], modulePath) => {
	const name = modulePath.split("/").at(-2);
	const component = componentFiles[modulePath];
	if (!component) return modules;
	const Component = lazy(component);
	modules.push({
		path: `/${name}`,
		element: <Component />,
	});
	return modules;
}, []);
routes.push({
	path: "*",
	element: <Navigate to={routes[0].path} replace />,
});
export default routes;
