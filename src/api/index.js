import axios from "axios";

class Api {
	client;
	constructor(baseURL) {
		this.client = axios.create({
			baseURL,
		});
		this.client.interceptors.request.use(this.requestInterceptors);
		this.client.interceptors.response.use(this.responseInterceptors);
	}

	requestInterceptors(config) {
		return config;
	}

	responseInterceptors(response) {
		if (response.status === 200) {
			return response.data;
		} else {
			return Promise.reject(response);
		}
	}

	get(url, params = {}, config = {}) {
		return this.client.get(url, {
			params,
			headers: {
				"Content-Type": "application/json",
			},
			...config,
		});
	}

	post(url, data = {}, config = {}) {
		return this.client.post(url, data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			...config,
		});
	}

	put(url, data = {}, config = {}) {
		return this.client.put(url, data, {
			headers: {
				"Content-Type": "application/json",
			},
			...config,
		});
	}

	delete(url, params = {}, config = {}) {
		return this.client.delete(url, {
			params,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			...config,
		});
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
