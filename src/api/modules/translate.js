import md5 from "md5";
export default class Translate {
	constructor(request) {
		this.request = request;
		this.baseUrl = "/";
	}
	translate({ q, from, to }) {
		// 注意：需要在实际使用时替换为自己的appid和密钥
		const appid = "20250411002329834"; // 替换为你的百度翻译API appid
		const key = "ZQZXbeqdMWVvHRxfY0IJ"; // 替换为你的百度翻译API key
		const salt = Math.floor(Math.random() * 1000000);
		// 生成签名
		const str = appid + q + salt + key;
		// 使用md5库生成签名
		const sign = md5(str);
		const data = {
			q,
			from,
			to,
			appid,
			salt,
			sign,
		};
		return this.request.post("/translate", data);
	}
}
