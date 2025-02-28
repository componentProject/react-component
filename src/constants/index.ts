export const external = ["react", "react-dom", "react-router-dom", "axios", "moment", "radash"];
const cdnModules = [
	{
		name: "react", // 模块名
		var: "React", // 全局变量名
		path: "https://unpkg.com/react@18/umd/react.development.js", // CDN 地址
	},
	{
		name: "react-dom", // 模块名
		var: "ReactDOM", // 全局变量名
		path: "https://unpkg.com/react-dom@18/umd/react-dom.development.js", // CDN 地址
	},
	{
		name: "react-router-dom", // 模块名
		var: "ReactRouterDOM", // 全局变量名
		path: "https://unpkg.com/react-router-dom@6/dist/react-router-dom.development.js", // CDN 地址
	},
	{
		name: "axios", // 模块名
		var: "axios", // 全局变量名
		path: "https://unpkg.com/axios/dist/axios.min.js", // CDN 地址
	},
	{
		name: "moment", // 模块名
		var: "moment", // 全局变量名
		path: "https://unpkg.com/moment/min/moment.min.js", // CDN 地址
	},
	{
		name: "radash", // 模块名
		var: "radash", // 全局变量名
		path: "https://unpkg.com/radash/dist/radash.min.js", // CDN 地址
	},
];

export const modules = cdnModules.filter((item) => external.includes(item.name));
