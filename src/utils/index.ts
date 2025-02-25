let count = 99;
export function getId(messageProps: { id?: number } = {}) {
	if (messageProps.id) {
		return messageProps.id;
	}
	count += 1;
	return count;
}

export function cloneDeep(obj: any, map = new WeakMap()) {
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}

	// 如果对象已经被拷贝过，直接返回缓存中的拷贝
	if (map.has(obj)) {
		return map.get(obj);
	}

	let clone: any;

	// 判断是数组还是对象
	if (Array.isArray(obj)) {
		clone = [];
		map.set(obj, clone);
		obj.forEach((item, index) => {
			clone[index] = cloneDeep(item, map);
		});
	} else {
		clone = {};
		map.set(obj, clone);
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				clone[key] = cloneDeep(obj[key], map);
			}
		}
	}

	// 处理函数类型
	if (typeof obj === "function") {
		clone[typeof obj] = obj.toString();
	}

	return clone;
}
