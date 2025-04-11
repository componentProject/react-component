import axios from "axios";

class Api {
	constructor(baseURL) {
		this.client = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
		});
		this.client.interceptors.request.use(this.requestInterceptors);
		this.client.interceptors.response.use(this.responseInterceptors);
	}

	requestInterceptors(config) {
		return config;
	}

	responseInterceptors(response) {
		return response;
	}

	get(url, params = {}, config) {
		return this.client.get(url, { params, ...config });
	}

	post(url, data = {}, config) {
		return this.client.post(url, data, config);
	}

	put(url, data = {}, config) {
		return this.client.put(url, data, config);
	}

	delete(url, params = {}, config) {
		return this.client.delete(url, { params, ...config });
	}
}

const Files = import.meta.glob("./modules/*.js", { eager: true, import: "default" });
const modules = {};
Object.keys(Files).forEach((key) => {
	const request = new Api(Files[key].baseURL);
	const module = new Files[key](request);
	const name = key.split("/").pop().split(".")[0] + "Api";
	modules[name] = module;
});

export default modules;
