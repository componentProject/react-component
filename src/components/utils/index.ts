let count = 99;
export function getId(messageProps: { id?: number } = {}) {
	if (messageProps.id) {
		return messageProps.id;
	}
	count += 1;
	return count;
}
